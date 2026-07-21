import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { JsonStore } from './json-store';

describe('JsonStore', () => {
  let tmpDir: string;
  let store: JsonStore;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'json-store-test-'));
    store = new JsonStore(tmpDir);
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates opportunities.json on init', () => {
    expect(existsSync(join(tmpDir, 'opportunities.json'))).toBe(true);
  });

  it('seeds default opportunities', async () => {
    const list = await store.list();
    expect(list.length).toBeGreaterThanOrEqual(7);
  });

  it('lists all opportunities', async () => {
    const list = await store.list();
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('title');
    expect(list[0]).toHaveProperty('status');
  });

  it('gets by id', async () => {
    const opp = await store.getById('1');
    expect(opp).not.toBeNull();
    expect(opp!.title).toBe('Senior React Developer');
  });

  it('returns null for non-existent id', async () => {
    const opp = await store.getById('non-existent');
    expect(opp).toBeNull();
  });

  it('creates a new opportunity', async () => {
    const created = await store.create({
      title: 'Test Job',
      source: 'Upwork',
      url: 'https://test.com',
      skills: ['Test'],
      description: 'Test description',
      status: 'discovered',
      matchScore: 50,
    });
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Test Job');
    expect(created.createdAt).toBeInstanceOf(Date);

    const list = await store.list();
    expect(list.length).toBeGreaterThanOrEqual(8);
  });

  it('updates an existing opportunity', async () => {
    const updated = await store.update('1', { title: 'Updated Title', status: 'won' });
    expect(updated.title).toBe('Updated Title');
    expect(updated.status).toBe('won');

    const fetched = await store.getById('1');
    expect(fetched!.title).toBe('Updated Title');
  });

  it('throws on update for non-existent id', async () => {
    await expect(store.update('non-existent', { title: 'Nope' })).rejects.toThrow('not found');
  });

  it('deletes an opportunity', async () => {
    await store.delete('1');
    const opp = await store.getById('1');
    expect(opp).toBeNull();
  });

  it('throws on delete for non-existent id', async () => {
    await expect(store.delete('non-existent')).rejects.toThrow('not found');
  });

  it('persists writes to disk', async () => {
    const created = await store.create({
      title: 'Persist Test',
      source: 'Upwork',
      url: 'https://test.com',
      skills: ['Test'],
      description: 'Should be on disk',
      status: 'discovered',
      matchScore: 50,
    });
    const raw = readFileSync(join(tmpDir, 'opportunities.json'), 'utf-8');
    const data = JSON.parse(raw);
    const found = data.find((o: any) => o.id === created.id);
    expect(found).toBeDefined();
    expect(found.title).toBe('Persist Test');
  });
});
