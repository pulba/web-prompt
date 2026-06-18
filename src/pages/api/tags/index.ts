import type { APIRoute } from 'astro';
import { tagService } from '@/lib/tags/service';

export const GET: APIRoute = async () => {
  try {
    const tags = await tagService.getAllTags();
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: tags });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const id = await tagService.createTag(body);
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: { id } }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 400 });
  }
};
