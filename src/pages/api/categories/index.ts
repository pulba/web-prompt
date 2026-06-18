import type { APIRoute } from 'astro';
import { categoryService } from '@/lib/categories/service';

export const GET: APIRoute = async () => {
  try {
    const categories = await categoryService.getAllCategories();
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: categories });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const id = await categoryService.createCategory(body);
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: { id } }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 400 });
  }
};
