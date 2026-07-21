import { NextResponse } from 'next/server';
import { join } from 'node:path';
import { ScoutEngine, OpportunityMatcher, ProfileStore } from '@ai-hunter/ai';

const DATA_DIR = join(process.cwd(), 'data');

export async function POST() {
  const profileStore = new ProfileStore(DATA_DIR);
  const profile = profileStore.get();
  const matcher = new OpportunityMatcher(profile);
  const engine = new ScoutEngine();

  const opportunities = await engine.scout(matcher);

  await new Promise((r) => setTimeout(r, 1200));

  return NextResponse.json({ opportunities });
}
