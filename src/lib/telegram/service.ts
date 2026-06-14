import { dbClient } from '@/lib/db';
import { parseTelegramMessage } from './parser';
import { telegramBot } from './bot';

export const telegramService = {
  async processMessage(chatId: number, text: string) {
    const parsed = parseTelegramMessage(text);

    try {
      // Use a variable outside the transaction to capture the result,
      // because @libsql/client's transaction() does not return the callback's return value.
      let promptId: number = 0;

      const tx = await dbClient.transaction('write');
      try {
        // 1. Handle Category
        let categoryId: number | null = null;
        if (parsed.category) {
          const catRes = await tx.execute({
            sql: 'SELECT id FROM categories WHERE LOWER(name) = LOWER(?)',
            args: [parsed.category]
          });
          
          if (catRes.rows.length > 0) {
            categoryId = Number(catRes.rows[0].id);
          } else {
            const newCat = await tx.execute({
              sql: 'INSERT INTO categories (name) VALUES (?)',
              args: [parsed.category]
            });
            categoryId = Number(BigInt(newCat.lastInsertRowid as any));
          }
        }

        // 2. Handle Tags
        const tagIds: number[] = [];
        for (const tagName of parsed.tags) {
          const tagRes = await tx.execute({
            sql: 'SELECT id FROM tags WHERE LOWER(name) = LOWER(?)',
            args: [tagName]
          });
          
          let tagId: number;
          if (tagRes.rows.length > 0) {
            tagId = Number(tagRes.rows[0].id);
          } else {
            const newTag = await tx.execute({
              sql: 'INSERT INTO tags (name) VALUES (?)',
              args: [tagName]
            });
            tagId = Number(BigInt(newTag.lastInsertRowid as any));
          }
          tagIds.push(tagId);
        }

        // 3. Create Prompt
        const promptRes = await tx.execute({
          sql: 'INSERT INTO prompts (title, content, category_id, source, favorite) VALUES (?, ?, ?, ?, ?)',
          args: [parsed.title, parsed.content, categoryId, 'Telegram Bot', 0],
        });
        promptId = Number(BigInt(promptRes.lastInsertRowid as any));

        // 4. Attach Tags
        if (tagIds.length > 0) {
          const values = tagIds.map(() => '(?, ?)').join(', ');
          const args = tagIds.flatMap(tId => [promptId, tId]);
          await tx.execute({
            sql: `INSERT OR IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES ${values}`,
            args,
          });
        }

        await tx.commit();
      } catch (txError) {
        await tx.rollback();
        throw txError;
      }

      await telegramBot.sendMessage(chatId, `✅ Prompt saved! ID: ${promptId}`);
      return promptId;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      await telegramBot.sendMessage(chatId, `❌ Error: ${message}`);
      throw e;
    }
  }
};
