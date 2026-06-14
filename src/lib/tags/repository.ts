import { dbClient } from '@/lib/db';
import type { Tag } from '@/lib/db/types';
import type { TagInput } from './validation';

export interface TagWithCount extends Tag {
  prompt_count: number;
}

export const tagRepository = {
  async findAllWithCount(): Promise<TagWithCount[]> {
    const result = await dbClient.execute(`
      SELECT t.*, COUNT(pt.prompt_id) as prompt_count 
      FROM tags t 
      LEFT JOIN prompt_tags pt ON t.id = pt.tag_id 
      GROUP BY t.id 
      ORDER BY t.name ASC
    `);
    return result.rows as unknown as TagWithCount[];
  },

  async findById(id: number): Promise<Tag | null> {
    const result = await dbClient.execute({
      sql: 'SELECT * FROM tags WHERE id = ?',
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Tag;
  },

  async findByName(name: string): Promise<Tag | null> {
    const result = await dbClient.execute({
      sql: 'SELECT * FROM tags WHERE name = ?',
      args: [name],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Tag;
  },

  async create(data: TagInput): Promise<number> {
    const result = await dbClient.execute({
      sql: 'INSERT INTO tags (name) VALUES (?)',
      args: [data.name],
    });
    return Number(result.lastInsertRowid);
  },

  async update(id: number, data: TagInput): Promise<void> {
    await dbClient.execute({
      sql: 'UPDATE tags SET name = ? WHERE id = ?',
      args: [data.name, id],
    });
  },

  async delete(id: number): Promise<void> {
    await dbClient.execute({
      sql: 'DELETE FROM tags WHERE id = ?',
      args: [id],
    });
  }
};
