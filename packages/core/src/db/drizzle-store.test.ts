import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { DrizzleStore } from './drizzle-store';
import { createDb } from './index';

let store: DrizzleStore;
let dbPath: string;
let tmpDir: string;

beforeAll(async () => {
  tmpDir = mkdtempSync(join(tmpdir(), 'drizzle-store-test-'));
  dbPath = join(tmpDir, 'test.db');
  const db = createDb(dbPath);

  await migrate(db, { migrationsFolder: join(import.meta.dirname, '..', '..', 'drizzle') });

  store = new DrizzleStore(db);
});

afterAll(() => {
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
});

describe('DrizzleStore', () => {
  it('lists opportunities (empty initially)', async () => {
    const list = await store.list();
    expect(list).toEqual([]);
  });

  it('creates an opportunity', async () => {
    const created = await store.create({
      title: 'Test Job', source: 'Upwork', url: 'https://test.com',
      skills: ['React'], description: 'Test', status: 'discovered', matchScore: 90,
    });
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Test Job');
    expect(created.createdAt).toBeInstanceOf(Date);

    const list = await store.list();
    expect(list).toHaveLength(1);
  });

  it('gets by id', async () => {
    const created = await store.create({
      title: 'Find Me', source: 'Upwork', url: '', skills: [], description: '', status: 'discovered', matchScore: 50,
    });
    const found = await store.getById(created.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe('Find Me');
  });

  it('returns null for non-existent id', async () => {
    const found = await store.getById('non-existent');
    expect(found).toBeNull();
  });

  it('updates an opportunity', async () => {
    const created = await store.create({
      title: 'Before', source: 'Upwork', url: '', skills: [], description: '', status: 'discovered', matchScore: 50,
    });
    const updated = await store.update(created.id, { title: 'After', status: 'won' });
    expect(updated.title).toBe('After');
    expect(updated.status).toBe('won');
  });

  it('throws on update for non-existent id', async () => {
    await expect(store.update('nope', { title: 'X' })).rejects.toThrow('not found');
  });

  it('deletes an opportunity', async () => {
    const created = await store.create({
      title: 'Delete Me', source: 'Upwork', url: '', skills: [], description: '', status: 'discovered', matchScore: 50,
    });
    await store.delete(created.id);
    const found = await store.getById(created.id);
    expect(found).toBeNull();
  });

  it('throws on delete for non-existent id', async () => {
    await expect(store.delete('nope')).rejects.toThrow('not found');
  });
});
