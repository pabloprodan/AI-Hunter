import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ProfileStore } from './profile';

describe('ProfileStore', () => {
  let tmpDir: string;
  let store: ProfileStore;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'profile-store-test-'));
    store = new ProfileStore(tmpDir);
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates profile.json with defaults on first get', () => {
    const profile = store.get();
    expect(profile.name).toBe('Freelancer');
    expect(profile.skills).toContain('React');
    expect(profile.hourlyRate.min).toBe(50);
    expect(profile.hourlyRate.max).toBe(150);
    expect(profile.platforms).toContain('Upwork');
    expect(profile.keywords).toContain('react');
    expect(profile.excludedKeywords).toContain('wordpress');
  });

  it('persists profile.json to disk', () => {
    store.get();
    expect(existsSync(join(tmpDir, 'profile.json'))).toBe(true);
  });

  it('updates and returns new profile', () => {
    store.update({
      name: 'Pro Dev',
      skills: ['Rust', 'Go'],
      hourlyRate: { min: 100, max: 250 },
      platforms: ['Toptal'],
      keywords: ['rust', 'systems'],
      excludedKeywords: ['php'],
    });
    const profile = store.get();
    expect(profile.name).toBe('Pro Dev');
    expect(profile.skills).toEqual(['Rust', 'Go']);
    expect(profile.hourlyRate.min).toBe(100);
  });

  it('writes updated profile to disk', () => {
    store.update({
      name: 'Updated',
      skills: ['Test'],
      hourlyRate: { min: 50, max: 100 },
      platforms: [],
      keywords: [],
      excludedKeywords: [],
    });
    const raw = readFileSync(join(tmpDir, 'profile.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed.name).toBe('Updated');
  });
});
