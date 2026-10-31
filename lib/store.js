// Where the prayer lists live.
// On Vercel: a private Blob store (BLOB_READ_WRITE_TOKEN is added when the store is connected).
// For local testing only: a folder named by LOCAL_DATA_DIR.
//
// index.json         { currentId, lists: [{ id, name, savedAt, count }] }  newest first
// lists/<id>.json    { id, name, savedAt, items: [ "...", ... ] }

import { put, get } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const INDEX = 'index.json';
const listPath = (id) => `lists/${id}.json`;
const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const localDir = () => process.env.LOCAL_DATA_DIR || '';

export function storageReady() {
  return blobOn() || Boolean(localDir());
}

async function readJson(file) {
  if (blobOn()) {
    const res = await get(file, { access: 'private', useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text());
  }
  if (localDir()) {
    try {
      return JSON.parse(await readFile(path.join(localDir(), file), 'utf8'));
    } catch {
      return null;
    }
  }
  return null;
}

async function writeJson(file, data) {
  const body = JSON.stringify(data);
  if (blobOn()) {
    await put(file, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  if (localDir()) {
    const target = path.join(localDir(), file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body);
    return;
  }
  throw new Error('storage-not-connected');
}

const summary = (list) => ({ id: list.id, name: list.name, savedAt: list.savedAt, count: list.items.length });

export async function readIndex() {
  const index = await readJson(INDEX);
  if (index && Array.isArray(index.lists)) return index;
  return { currentId: null, lists: [] };
}

export async function readList(id) {
  if (!id || !/^[\w-]+$/.test(id)) return null;
  return readJson(listPath(id));
}

export async function currentList() {
  const index = await readIndex();
  return readList(index.currentId);
}

export async function saveList(name, items) {
  const index = await readIndex();
  const now = new Date();
  const id = now.toISOString().replace(/[:.]/g, '-') + '-' + Math.random().toString(36).slice(2, 6);
  const list = { id, name, savedAt: now.toISOString(), items };
  await writeJson(listPath(id), list);
  const next = { currentId: id, lists: [summary(list), ...index.lists] };
  await writeJson(INDEX, next);
  return next;
}

export async function showList(id) {
  const index = await readIndex();
  if (!index.lists.some((list) => list.id === id)) throw new Error('not-found');
  const next = { ...index, currentId: id };
  await writeJson(INDEX, next);
  return next;
}
