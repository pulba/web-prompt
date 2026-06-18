import type { APIRoute } from 'astro';
import { promptService } from '@/lib/prompts/service';

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const prompt = await promptService.getPrompt(id);
    if (!prompt) {
      // ponytail: using standard Response.json()
      return Response.json({ success: false, error: 'Prompt not found' }, { status: 404 });
    }
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: prompt });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { tags, toggleFavorite, ...promptData } = body;
    const tagIds = Array.isArray(tags) ? tags.map(Number) : undefined;

    if (toggleFavorite) {
      await promptService.toggleFavorite(id);
    } else {
      await promptService.updatePrompt(id, promptData, tagIds);
    }
    // ponytail: using standard Response.json()
    return Response.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await promptService.deletePrompt(id);
    // ponytail: using standard Response.json()
    return Response.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};
