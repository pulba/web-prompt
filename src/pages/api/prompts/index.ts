import type { APIRoute } from 'astro';
import { promptService } from '@/lib/prompts/service';

export const GET: APIRoute = async () => {
  try {
    const prompts = await promptService.getAllPrompts();
    return new Response(JSON.stringify({ success: true, data: prompts }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tags, ...promptData } = body;
    const tagIds = Array.isArray(tags) ? tags.map(Number) : [];
    
    const id = await promptService.createPrompt(promptData, tagIds);
    return new Response(JSON.stringify({ success: true, data: { id } }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
