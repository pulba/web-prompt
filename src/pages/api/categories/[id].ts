import type { APIRoute } from 'astro';
import { categoryService } from '@/lib/categories/service';

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (isNaN(id)) {
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const category = await categoryService.getCategory(id);
    if (!category) {
      // ponytail: using standard Response.json()
      return Response.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    // ponytail: using standard Response.json()
    return Response.json({ success: true, data: category });
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
    await categoryService.updateCategory(id, body);
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
    await categoryService.deleteCategory(id);
    // ponytail: using standard Response.json()
    return Response.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    // ponytail: using standard Response.json()
    return Response.json({ success: false, error: message }, { status: 500 });
  }
};
