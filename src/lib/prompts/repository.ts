import { dbClient } from '@/lib/db';
import type { Prompt, Tag } from '@/lib/db/types';
import type { PromptInput } from './validation';

export interface PromptWithRelations extends Prompt {
  category_name?: string;
  tags?: Tag[];
}

export const promptRepository = {
  async findAll(): Promise<PromptWithRelations[]> {
    const result = await dbClient.execute(`
      SELECT 
        p.*, 
        c.name as category_name,
        GROUP_CONCAT(t.id || ':' || t.name) as tags_data
      FROM prompts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    return result.rows.map(row => {
      const prompt = row as unknown as PromptWithRelations & { tags_data: string | null };
      const tags: Tag[] = [];
      
      if (prompt.tags_data) {
        prompt.tags_data.split(',').forEach(tagStr => {
          const [id, name] = tagStr.split(':');
          tags.push({ id: Number(id), name });
        });
      }
      
      const { tags_data, ...rest } = prompt;
      return { ...rest, tags };
    });
  },

  async findById(id: number): Promise<PromptWithRelations | null> {
    const result = await dbClient.execute({
      sql: `
        SELECT 
          p.*, 
          c.name as category_name,
          GROUP_CONCAT(t.id || ':' || t.name) as tags_data
        FROM prompts p 
        LEFT JOIN categories c ON p.category_id = c.id 
        LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.id = ?
        GROUP BY p.id
      `,
      args: [id],
    });
    
    if (result.rows.length === 0) return null;
    
    const prompt = result.rows[0] as unknown as PromptWithRelations & { tags_data: string | null };
    const tags: Tag[] = [];
    
    if (prompt.tags_data) {
      prompt.tags_data.split(',').forEach(tagStr => {
        const [id, name] = tagStr.split(':');
        tags.push({ id: Number(id), name });
      });
    }
    
    const { tags_data, ...rest } = prompt;
    return { ...rest, tags };
  },

  async create(data: PromptInput): Promise<number> {
    const result = await dbClient.execute({
      sql: 'INSERT INTO prompts (title, content, category_id, source, favorite) VALUES (?, ?, ?, ?, ?)',
      args: [data.title, data.content, data.category_id ?? null, data.source ?? null, data.favorite],
    });
    return Number(result.lastInsertRowid);
  },

  async update(id: number, data: Partial<PromptInput>): Promise<void> {
    const allowedFields: (keyof PromptInput)[] = ['title', 'content', 'category_id', 'source', 'favorite'];
    const sets: string[] = [];
    const args: (string | number | null)[] = [];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        sets.push(`${field} = ?`);
        args.push(data[field] ?? null);
      }
    }

    if (sets.length === 0) return;

    args.push(id);
    await dbClient.execute({
      sql: `UPDATE prompts SET ${sets.join(', ')} WHERE id = ?`,
      args,
    });
  },

  async delete(id: number): Promise<void> {
    await dbClient.execute({
      sql: 'DELETE FROM prompts WHERE id = ?',
      args: [id],
    });
  },

  async toggleFavorite(id: number): Promise<void> {
    await dbClient.execute({
      sql: 'UPDATE prompts SET favorite = CASE WHEN favorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
      args: [id],
    });
  },

  async findFavorites(): Promise<PromptWithRelations[]> {
    const result = await dbClient.execute(`
      SELECT 
        p.*, 
        c.name as category_name,
        GROUP_CONCAT(t.id || ':' || t.name) as tags_data
      FROM prompts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.favorite = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    return result.rows.map(row => {
      const prompt = row as unknown as PromptWithRelations & { tags_data: string | null };
      const tags: Tag[] = [];
      
      if (prompt.tags_data) {
        prompt.tags_data.split(',').forEach(tagStr => {
          const [id, name] = tagStr.split(':');
          tags.push({ id: Number(id), name });
        });
      }
      
      const { tags_data, ...rest } = prompt;
      return { ...rest, tags };
    });
  },

  async attachTags(promptId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) return;
    
    const values = tagIds.map(() => '(?, ?)').join(', ');
    const args = tagIds.flatMap(tagId => [promptId, tagId]);
    
    await dbClient.execute({
      sql: `INSERT OR IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES ${values}`,
      args,
    });
  },

  async detachAllTags(promptId: number): Promise<void> {
    await dbClient.execute({
      sql: 'DELETE FROM prompt_tags WHERE prompt_id = ?',
      args: [promptId],
    });
  }
};
