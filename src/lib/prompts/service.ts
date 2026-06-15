import { dbClient } from '@/lib/db';
import { promptRepository } from './repository';
import { promptSchema, type PromptInput } from './validation';

export const promptService = {
  async getAllPrompts() {
    return promptRepository.findAll();
  },

  async getPrompt(id: number) {
    return promptRepository.findById(id);
  },

  async createPrompt(data: unknown, tagIds?: number[]) {
    const validated = promptSchema.parse(data);
    
    const tx = await dbClient.transaction('write');
    try {
      const result = await tx.execute({
        sql: 'INSERT INTO prompts (title, content, category_id, source, favorite) VALUES (?, ?, ?, ?, ?)',
        args: [validated.title, validated.content, validated.category_id ?? null, validated.source ?? null, validated.favorite],
      });
      
      const id = Number(result.lastInsertRowid);
      
      if (tagIds && tagIds.length > 0) {
        const values = tagIds.map(() => '(?, ?)').join(', ');
        const args = tagIds.flatMap(tagId => [id, tagId]);
        await tx.execute({
          sql: `INSERT OR IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES ${values}`,
          args,
        });
      }
      
      await tx.commit();
      return id;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  },

  async updatePrompt(id: number, data: unknown, tagIds?: number[]) {
    const validated = promptSchema.partial().parse(data);
    
    const tx = await dbClient.transaction('write');
    try {
      // Update prompt fields
      const allowedFields: (keyof PromptInput)[] = ['title', 'content', 'category_id', 'source', 'favorite'];
      const sets: string[] = [];
      const args: (string | number | null)[] = [];

      for (const field of allowedFields) {
        if (validated[field] !== undefined) {
          sets.push(`${field} = ?`);
          args.push(validated[field] ?? null);
        }
      }

      if (sets.length > 0) {
        args.push(id);
        await tx.execute({
          sql: `UPDATE prompts SET ${sets.join(', ')} WHERE id = ?`,
          args,
        });
      }

      // Sync tags if provided
      if (tagIds !== undefined) {
        await tx.execute({
          sql: 'DELETE FROM prompt_tags WHERE prompt_id = ?',
          args: [id],
        });
        
        if (tagIds.length > 0) {
          const values = tagIds.map(() => '(?, ?)').join(', ');
          const args = tagIds.flatMap(tagId => [id, tagId]);
          await tx.execute({
            sql: `INSERT OR IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES ${values}`,
            args,
          });
        }
      }

      await tx.commit();
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  },

  async deletePrompt(id: number) {
    // prompt_tags will be deleted by CASCADE in DB
    return promptRepository.delete(id);
  },

  async toggleFavorite(id: number) {
    return promptRepository.toggleFavorite(id);
  },

  async getFavorites() {
    return promptRepository.findFavorites();
  },

  async syncTags(promptId: number, tagIds: number[]) {
    await promptRepository.detachAllTags(promptId);
    if (tagIds.length > 0) {
      await promptRepository.attachTags(promptId, tagIds);
    }
  }
};
