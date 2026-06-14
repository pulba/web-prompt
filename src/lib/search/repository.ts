import { dbClient } from '@/lib/db';
import type { PromptWithRelations } from '@/lib/prompts/repository';
import type { Tag } from '@/lib/db/types';

export interface SearchParams {
  q?: string;
  category?: number;
  tag?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  items: PromptWithRelations[];
  total: number;
  page: number;
  limit: number;
}

export const searchRepository = {
  async search(params: SearchParams): Promise<SearchResult> {
    const { q, category, tag, page = 1, limit = 10 } = params;
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const offset = (validatedPage - 1) * validatedLimit;

    let sql = `
      SELECT 
        p.*, 
        c.name as category_name,
        GROUP_CONCAT(t.id || ':' || t.name) as tags_data
      FROM prompts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN prompt_tags pt ON p.id = pt.prompt_id
      LEFT JOIN tags t ON pt.tag_id = t.id
    `;

    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (q) {
      // Use FTS5 for keyword search
      conditions.push(`p.id IN (SELECT prompt_id FROM prompts_search WHERE prompts_search MATCH ?)`);
      args.push(q);
    }

    if (category) {
      conditions.push(`p.category_id = ?`);
      args.push(category);
    }

    if (tag) {
      conditions.push(`p.id IN (SELECT prompt_id FROM prompt_tags WHERE tag_id = ?)`);
      args.push(tag);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    args.push(validatedLimit, offset);

    const result = await dbClient.execute({ sql, args });
    
    const items = result.rows.map(row => {
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

    // Count total
    let countSql = `SELECT COUNT(DISTINCT p.id) as total FROM prompts p`;
    const countArgs: (string | number)[] = [];
    
    if (q || category || tag) {
        const countConditions: string[] = [];
        if (q) {
            countConditions.push(`p.id IN (SELECT prompt_id FROM prompts_search WHERE prompts_search MATCH ?)`);
            countArgs.push(q);
        }
        if (category) {
            countConditions.push(`p.category_id = ?`);
            countArgs.push(category);
        }
        if (tag) {
            countConditions.push(`p.id IN (SELECT prompt_id FROM prompt_tags WHERE tag_id = ?)`);
            countArgs.push(tag);
        }
        countSql += ` WHERE ${countConditions.join(' AND ')}`;
    }

    const countResult = await dbClient.execute({ sql: countSql, args: countArgs });
    const total = Number(countResult.rows[0].total);
    return { items, total, page: validatedPage, limit: validatedLimit };
  }
};
