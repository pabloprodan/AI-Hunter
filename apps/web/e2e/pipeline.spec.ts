import { test, expect } from '@playwright/test';

test.describe('Pipeline', () => {
  test('pipeline API returns grouped data with metrics', async ({ request }) => {
    const res = await request.get('/api/pipeline');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('grouped');
    expect(data).toHaveProperty('metrics');
    expect(data.grouped).toHaveProperty('discovered');
    expect(data.grouped).toHaveProperty('won');
    expect(data.grouped).toHaveProperty('lost');
  });

  test('opportunities API returns list', async ({ request }) => {
    const res = await request.get('/api/opportunities');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('status');
  });
});
