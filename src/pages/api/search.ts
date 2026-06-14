import type { APIRoute } from 'astro';
import { searchService } from '@/lib/search/service';

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q') || undefined;
  const category = url.searchParams.get('category') ? Number(url.searchParams.get('category')) : undefined;
  const tag = url.searchParams.get('tag') ? Number(url.searchParams.get('tag')) : undefined;
  const page = url.searchParams.get('page') ? Number(url.searchParams.get('page')) : 1;
  const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 10;

  try {
    const results = await searchService.searchPrompts({ q, category, tag, page, limit });
    return new Response(JSON.stringify({ success: true, data: results }), {
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
