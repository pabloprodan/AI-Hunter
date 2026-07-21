import { test, expect } from '@playwright/test';

test.describe('AI Scout', () => {
  test('scout API returns opportunities', async ({ request }) => {
    const res = await request.post('/api/scout');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('opportunities');
    expect(data.opportunities.length).toBeGreaterThanOrEqual(3);
    for (const opp of data.opportunities) {
      expect(opp).toHaveProperty('title');
      expect(opp).toHaveProperty('matchScore');
      expect(opp).toHaveProperty('status', 'discovered');
    }
  });

  test('scout opportunities have match scores', async ({ request }) => {
    const res = await request.post('/api/scout');
    const data = await res.json();
    for (const opp of data.opportunities) {
      expect(typeof opp.matchScore).toBe('number');
      expect(opp.matchScore).toBeGreaterThanOrEqual(0);
      expect(opp.matchScore).toBeLessThanOrEqual(100);
    }
  });

  test('profile API returns user profile', async ({ request }) => {
    const res = await request.get('/api/profile');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('skills');
    expect(data).toHaveProperty('hourlyRate');
  });
});
