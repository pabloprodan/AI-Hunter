import { describe, it, expect } from 'vitest';
import type { Opportunity, OpportunityStatus } from '@ai-hunter/types';
import type { StorageAdapter } from '../storage';
import { PipelineService } from './pipeline';

function mockStorage(initial: Opportunity[] = []): StorageAdapter {
  const data: Opportunity[] = [...initial];
  let nextId = 1;

  return {
    async list() {
      return data;
    },
    async getById(id: string) {
      return data.find((o) => o.id === id) ?? null;
    },
    async create(input) {
      const opp: Opportunity = {
        ...input,
        id: String(nextId++),
        createdAt: new Date(),
      };
      data.push(opp);
      return opp;
    },
    async update(id, input) {
      const idx = data.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error(`Opportunity ${id} not found`);
      data[idx] = { ...data[idx], ...input };
      return data[idx];
    },
    async delete(id) {
      const idx = data.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error(`Opportunity ${id} not found`);
      data.splice(idx, 1);
    },
  };
}

const sample: Opportunity[] = [
  {
    id: '1', title: 'Job A', source: 'Upwork', url: '', skills: ['React'],
    description: '', status: 'discovered', matchScore: 90, createdAt: new Date(),
  },
  {
    id: '2', title: 'Job B', source: 'LinkedIn', url: '', skills: ['Node'],
    description: '', status: 'applied', matchScore: 80, createdAt: new Date(),
  },
  {
    id: '3', title: 'Job C', source: 'Fiverr', url: '', skills: ['Python'],
    description: '', status: 'won', matchScore: 95, createdAt: new Date(),
    budget: 10000, clientName: 'Client A',
  },
  {
    id: '4', title: 'Job D', source: 'Upwork', url: '', skills: ['Go'],
    description: '', status: 'lost', matchScore: 70, createdAt: new Date(),
  },
];

describe('PipelineService', () => {
  it('lists all opportunities', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const list = await svc.listAll();
    expect(list).toHaveLength(4);
  });

  it('gets by id', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const opp = await svc.getById('1');
    expect(opp?.title).toBe('Job A');
  });

  it('creates an opportunity', async () => {
    const svc = new PipelineService(mockStorage());
    const created = await svc.create({
      title: 'New Job', source: 'Toptal', url: '', skills: ['Rust'],
      description: '', status: 'discovered', matchScore: 85,
    });
    expect(created.id).toBe('1');
  });

  it('updates status', async () => {
    const svc = new PipelineService(mockStorage(sample));
    await svc.updateStatus('1', 'qualified');
    const opp = await svc.getById('1');
    expect(opp?.status).toBe('qualified');
  });

  it('deletes an opportunity', async () => {
    const svc = new PipelineService(mockStorage(sample));
    await svc.delete('1');
    const list = await svc.listAll();
    expect(list).toHaveLength(3);
  });

  it('filters by status', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const won = await svc.getByStatus('won');
    expect(won).toHaveLength(1);
    expect(won[0].title).toBe('Job C');
  });

  it('groups by status', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const grouped = await svc.getGrouped();
    expect(grouped.discovered).toHaveLength(1);
    expect(grouped.applied).toHaveLength(1);
    expect(grouped.won).toHaveLength(1);
    expect(grouped.lost).toHaveLength(1);
    expect(grouped.qualified).toHaveLength(0);
    expect(grouped.interviewing).toHaveLength(0);
  });

  it('computes metrics correctly', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const metrics = await svc.getMetrics();
    expect(metrics.total).toBe(4);
    expect(metrics.won).toBe(1);
    expect(metrics.lost).toBe(1);
    expect(metrics.conversionRate).toBe(50);
    expect(metrics.averageDealSize).toBe(10000);
  });

  it('returns 0 conversion rate when no closed deals', async () => {
    const svc = new PipelineService(mockStorage(sample.filter(o => o.status === 'discovered')));
    const metrics = await svc.getMetrics();
    expect(metrics.conversionRate).toBe(0);
    expect(metrics.averageDealSize).toBe(0);
  });

  it('searches by title', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const results = await svc.search('job');
    expect(results).toHaveLength(4);
  });

  it('searches by client name', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const results = await svc.search('client a');
    expect(results).toHaveLength(1);
  });

  it('searches by skill', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const results = await svc.search('react');
    expect(results).toHaveLength(1);
  });

  it('returns empty for no match', async () => {
    const svc = new PipelineService(mockStorage(sample));
    const results = await svc.search('zzzzz');
    expect(results).toHaveLength(0);
  });

  it('returns status order', () => {
    const svc = new PipelineService(mockStorage());
    expect(svc.getStatusOrder()).toEqual([
      'discovered', 'qualified', 'applied', 'interviewing', 'won', 'lost',
    ]);
  });
});
