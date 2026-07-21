import { eq } from 'drizzle-orm';
import type { Opportunity } from '@ai-hunter/types';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { StorageAdapter } from '../storage';
import * as schema from './schema';

export class DrizzleStore implements StorageAdapter {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async list() {
    const rows = await this.db.select().from(schema.opportunities);
    return rows.map(toOpportunity);
  }

  async getById(id: string) {
    const rows = await this.db.select().from(schema.opportunities).where(eq(schema.opportunities.id, id));
    if (rows.length === 0) return null;
    return toOpportunity(rows[0]);
  }

  async create(input: Omit<Opportunity, 'id' | 'createdAt'>) {
    const opp: Opportunity = {
      ...input,
      id: String(Date.now()),
      createdAt: new Date(),
    };
    await this.db.insert(schema.opportunities).values(toRow(opp));
    return opp;
  }

  async update(id: string, input: Partial<Opportunity>) {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Opportunity ${id} not found`);
    const updated = { ...existing, ...input };
    await this.db.update(schema.opportunities).set(toRow(updated)).where(eq(schema.opportunities.id, id));
    return updated;
  }

  async delete(id: string) {
    const existing = await this.getById(id);
    if (!existing) throw new Error(`Opportunity ${id} not found`);
    await this.db.delete(schema.opportunities).where(eq(schema.opportunities.id, id));
  }
}

function toRow(opp: Opportunity): typeof schema.opportunities.$inferInsert {
  return {
    id: opp.id,
    title: opp.title,
    source: opp.source,
    url: opp.url,
    budget: opp.budget ?? null,
    skills: opp.skills,
    clientName: opp.clientName ?? null,
    description: opp.description,
    status: opp.status,
    matchScore: opp.matchScore,
    createdAt: (opp.createdAt instanceof Date ? opp.createdAt : new Date(opp.createdAt)).toISOString(),
  };
}

function toOpportunity(row: typeof schema.opportunities.$inferSelect): Opportunity {
  return {
    id: row.id,
    title: row.title,
    source: row.source,
    url: row.url,
    budget: row.budget ?? undefined,
    skills: row.skills ?? [],
    clientName: row.clientName ?? undefined,
    description: row.description,
    status: row.status as Opportunity['status'],
    matchScore: row.matchScore,
    createdAt: new Date(row.createdAt),
  };
}
