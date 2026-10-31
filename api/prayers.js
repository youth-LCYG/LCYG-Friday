// GET /api/prayers  ->  the prayer list the screens should show right now.
// Public: the prayer screens read it without signing in.

import { currentList } from '../lib/store.js';

export async function GET() {
  try {
    const list = await currentList();
    const body = list || { id: null, name: null, savedAt: null, items: [] };
    return Response.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
