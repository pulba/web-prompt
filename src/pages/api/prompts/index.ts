import type { APIRoute } from 'astro';
import { promptService } from '@/lib/prompts/service';

export const GET: APIRoute = async () => {
  try {
    const prompts = await promptService.getAllPrompts();
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: prompts });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tags, ...promptData } = body;
    const tagIds = Array.isArray(tags) ? tags.map(Number) : [];
    
    const id = await promptService.createPrompt(promptData, tagIds);
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: { id } }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 400 });
  }
};
