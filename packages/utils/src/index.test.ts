import { describe, it, expect } from 'vitest';

describe('utils', () => {
  it('exports are defined', async () => {
    const mod = await import('./index');
    expect(mod).toBeDefined();
  });
});
