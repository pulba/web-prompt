import { dbClient } from '@/lib/db';
import type { Category } from '@/lib/db/types';
import type { CategoryInput } from './validation';

export const categoryRepository = {
  async findAll(): Promise<Category[]> {
    const result = await dbClient.execute('SELECT * FROM categories ORDER BY name ASC');
    return result.rows as unknown as Category[];
  },

  async findById(id: number): Promise<Category | null> {
    const result = await dbClient.execute({
      sql: 'SELECT * FROM categories WHERE id = ?',
      args: [id],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Category;
  },

  async findByName(name: string): Promise<Category | null> {
    const result = await dbClient.execute({
      sql: 'SELECT * FROM categories WHERE name = ?',
      args: [name],
    });
    if (result.rows.length === 0) return null;
    return result.rows[0] as unknown as Category;
  },

  async create(data: CategoryInput): Promise<number> {
    const result = await dbClient.execute({
      sql: 'INSERT INTO categories (name) VALUES (?)',
      args: [data.name],
    });
    return Number(result.lastInsertRowid);
  },

  async update(id: number, data: CategoryInput): Promise<void> {
    await dbClient.execute({
      sql: 'UPDATE categories SET name = ? WHERE id = ?',
      args: [data.name, id],
    });
  },

  async delete(id: number): Promise<void> {
    await dbClient.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id],
    });
  }
};
