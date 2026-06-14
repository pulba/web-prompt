import type { APIRoute } from 'astro';
import { categoryService } from '@/lib/categories/service';

export const GET: APIRoute = async () => {
  try {
    const categories = await categoryService.getAllCategories();
    return new Response(JSON.stringify({ success: true, data: categories }), { 
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
    const id = await categoryService.createCategory(body);
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
