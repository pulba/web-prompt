import type { ParsedTelegramMessage } from './validation';

export function parseTelegramMessage(text: string): ParsedTelegramMessage {
  const lines = text.split('\n').map(l => l.trim());
  
  let category: string | null = null;
  const tags: string[] = [];
  let title = '';
  let contentLines: string[] = [];
  
  let contentStarted = false;

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith('#')) {
      if (!contentStarted) {
        const tagOrCat = line.substring(1).trim();
        if (!category) {
          category = tagOrCat;
        } else {
          tags.push(tagOrCat);
        }
      } else {
        contentLines.push(line);
      }
      continue;
    }

    if (line.toLowerCase().startsWith('judul:')) {
      title = line.substring(6).trim();
      contentStarted = true;
      continue;
    }

    if (contentStarted) {
      contentLines.push(line);
    }
  }

  return {
    title: title || 'Untitled Telegram Prompt',
    content: contentLines.join('\n'),
    category,
    tags
  };
}
