// /api/admin  ->  saved lists, saving a new list, choosing which list to show.
// Every request needs the admin password in the "x-admin-password" header.
// The password is the ADMIN_PASSWORD environment variable in the Vercel project settings.

import { createHash, timingSafeEqual } from 'node:crypto';
import { readIndex, readList, saveList, showList, storageReady } from '../lib/store.js';

const NO_STORE = { 'Cache-Control': 'no-store' };
const json = (data, status = 200) => Response.json(data, { status, headers: NO_STORE });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sameText(a, b) {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

async function refuse(request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return json({ error: 'not-configured' }, 503);
  const given = request.headers.get('x-admin-password') || '';
  if (!sameText(given, expected)) {
    await wait(600);
    return json({ error: 'wrong-password' }, 401);
  }
  return null;
}

async function state() {
  const index = await readIndex();
  const current = await readList(index.currentId);
  return { currentId: index.currentId, lists: index.lists, current, canSave: storageReady() };
}

export async function GET(request) {
  const refused = await refuse(request);
  if (refused) return refused;
  return json(await state());
}

export async function POST(request) {
  const refused = await refuse(request);
  if (refused) return refused;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad-request' }, 400);
  }

  try {
    if (body.action === 'save') {
      const items = (Array.isArray(body.items) ? body.items : [])
        .map((line) => String(line).trim().slice(0, 600))
        .filter(Boolean)
        .slice(0, 300);
      if (!items.length) return json({ error: 'empty' }, 400);
      const name = String(body.name || '').trim().slice(0, 80) || 'Prayer list';
      await saveList(name, items);
    } else if (body.action === 'show') {
      await showList(String(body.id || ''));
    } else {
      return json({ error: 'bad-request' }, 400);
    }
  } catch (error) {
    const message = error && error.message;
    if (message === 'not-found') return json({ error: 'not-found' }, 404);
    if (message === 'storage-not-connected') return json({ error: 'storage-not-connected' }, 503);
    return json({ error: 'save-failed' }, 500);
  }

  return json(await state());
}
