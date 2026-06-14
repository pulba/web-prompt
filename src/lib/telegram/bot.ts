const getEnv = (key: string): string | undefined => {
  return import.meta.env[key] || process.env[key];
};

const BOT_TOKEN = getEnv('TELEGRAM_BOT_TOKEN');
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const telegramBot = {
  async sendMessage(chatId: number, text: string) {
    return fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  },

  async setWebhook(url: string, secretToken: string) {
    return fetch(`${BASE_URL}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url, 
        secret_token: secretToken 
      }),
    });
  },

  async deleteWebhook() {
    return fetch(`${BASE_URL}/deleteWebhook`);
  }
};
