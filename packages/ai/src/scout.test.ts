import { describe, it, expect } from 'vitest';
import { ScoutEngine } from './scout';
import { OpportunityMatcher } from './matcher';
import type { UserProfile } from './profile';

const profile: UserProfile = {
  name: 'Test',
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
  hourlyRate: { min: 50, max: 150 },
  platforms: ['Upwork', 'Toptal'],
  keywords: ['react', 'full stack', 'frontend'],
  excludedKeywords: ['wordpress', 'php', 'shopify'],
};

describe('ScoutEngine', () => {
  it('returns opportunities with match scores', async () => {
    const engine = new ScoutEngine();
    const matcher = new OpportunityMatcher(profile);
    const results = await engine.scout(matcher);
    expect(results.length).toBeGreaterThanOrEqual(3);
    expect(results.length).toBeLessThanOrEqual(7);
  });

  it('returns opportunities with correct shape', async () => {
    const engine = new ScoutEngine();
    const matcher = new OpportunityMatcher(profile);
    const results = await engine.scout(matcher);
    for (const opp of results) {
      expect(opp).toHaveProperty('id');
      expect(opp).toHaveProperty('title');
      expect(opp).toHaveProperty('source');
      expect(opp).toHaveProperty('matchScore');
      expect(opp).toHaveProperty('status', 'discovered');
      expect(opp).toHaveProperty('createdAt');
      expect(opp.createdAt).toBeInstanceOf(Date);
    }
  });

  it('generates unique ids per call', async () => {
    const engine = new ScoutEngine();
    const matcher = new OpportunityMatcher(profile);
    const [batch1, batch2] = await Promise.all([
      engine.scout(matcher),
      engine.scout(matcher),
    ]);
    const ids1 = batch1.map((o) => o.id);
    const ids2 = batch2.map((o) => o.id);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap).toHaveLength(0);
  });
});
