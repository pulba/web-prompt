import type { APIRoute } from 'astro';
import { tagService } from '@/lib/tags/service';

export const GET: APIRoute = async () => {
  try {
    const tags = await tagService.getAllTags();
    return new Response(JSON.stringify({ success: true, data: tags }), { 
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
    const id = await tagService.createTag(body);
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
