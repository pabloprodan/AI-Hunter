import type { Opportunity, OpportunityStatus, PipelineMetrics } from '@ai-hunter/types';
import type { StorageAdapter } from '../storage';

const PIPELINE_ORDER: OpportunityStatus[] = [
  'discovered',
  'qualified',
  'applied',
  'interviewing',
  'won',
  'lost',
];

export class PipelineService {
  constructor(private storage: StorageAdapter) {}

  async listAll() {
    return this.storage.list();
  }

  async getById(id: string) {
    return this.storage.getById(id);
  }

  async create(input: Omit<Opportunity, 'id' | 'createdAt'>) {
    return this.storage.create(input);
  }

  async updateStatus(id: string, status: OpportunityStatus) {
    return this.storage.update(id, { status });
  }

  async update(id: string, data: Partial<Opportunity>) {
    return this.storage.update(id, data);
  }

  async delete(id: string) {
    return this.storage.delete(id);
  }

  async getByStatus(status: OpportunityStatus) {
    const all = await this.storage.list();
    return all.filter((o) => o.status === status);
  }

  async getGrouped() {
    const all = await this.storage.list();
    const grouped: Record<OpportunityStatus, Opportunity[]> = {
      discovered: [],
      qualified: [],
      applied: [],
      interviewing: [],
      won: [],
      lost: [],
    };
    for (const opp of all) {
      grouped[opp.status].push(opp);
    }
    return grouped;
  }

  async getMetrics(): Promise<PipelineMetrics> {
    const all = await this.storage.list();
    const won = all.filter((o) => o.status === 'won');
    const lost = all.filter((o) => o.status === 'lost');
    const closed = won.length + lost.length;

    return {
      total: all.length,
      won: won.length,
      lost: lost.length,
      conversionRate: closed > 0 ? Math.round((won.length / closed) * 100) : 0,
      averageDealSize: won.length > 0
        ? Math.round(won.reduce((sum, o) => sum + (o.budget ?? 0), 0) / won.length)
        : 0,
    };
  }

  async search(query: string) {
    const all = await this.storage.list();
    const q = query.toLowerCase();
    return all.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.clientName?.toLowerCase().includes(q) ||
        o.source.toLowerCase().includes(q) ||
        o.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }

  getStatusOrder() {
    return PIPELINE_ORDER;
  }
}
