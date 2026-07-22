import { NextResponse } from 'next/server';
import { join } from 'node:path';
import { JsonStore, PipelineService } from '@ai-hunter/core';
import { AutoApplyAgent, ProfileStore } from '@ai-hunter/ai';

const DATA_DIR = join(process.cwd(), 'data');
const store = new JsonStore(DATA_DIR);
const pipeline = new PipelineService(store);

export async function GET() {
  const all = await pipeline.listAll();
  const candidates = all.filter(
    (o) => o.matchScore >= 80 && (o.status === 'discovered' || o.status === 'qualified'),
  );
  return NextResponse.json({ candidates });
}

export async function POST(request: Request) {
  const body = await request.json();
  const profileStore = new ProfileStore(DATA_DIR);
  const profile = profileStore.get();
  const agent = new AutoApplyAgent(profile);

  if (body.opportunityId) {
    const opportunity = await pipeline.getById(body.opportunityId);
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }
    const result = await agent.apply(opportunity);
    if (result.success) {
      await pipeline.updateStatus(opportunity.id, 'applied');
    }
    return NextResponse.json({
      applied: 1,
      results: [{ id: opportunity.id, title: opportunity.title, success: result.success }],
    });
  }

  if (body.auto) {
    const all = await pipeline.listAll();
    const candidates = all.filter(
      (o) => o.matchScore >= 80 && (o.status === 'discovered' || o.status === 'qualified'),
    );
    const results = [];
    for (const opp of candidates) {
      const result = await agent.apply(opp);
      if (result.success) {
        await pipeline.updateStatus(opp.id, 'applied');
      }
      results.push({ id: opp.id, title: opp.title, success: result.success });
    }
    return NextResponse.json({ applied: results.length, results });
  }

  return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
}
