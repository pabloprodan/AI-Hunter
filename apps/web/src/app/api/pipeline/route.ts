import { NextResponse } from 'next/server';
import { JsonStore, PipelineService } from '@ai-hunter/core';
import { join } from 'node:path';

const store = new JsonStore(join(process.cwd(), 'data'));
const pipeline = new PipelineService(store);

export async function GET() {
  const [grouped, metrics] = await Promise.all([
    pipeline.getGrouped(),
    pipeline.getMetrics(),
  ]);
  return NextResponse.json({ grouped, metrics });
}
