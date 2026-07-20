import { NextResponse } from 'next/server';
import { JsonStore, PipelineService } from '@ai-hunter/core';
import { join } from 'node:path';

const store = new JsonStore(join(process.cwd(), 'data'));
const pipeline = new PipelineService(store);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const q = searchParams.get('q');

  if (status) {
    const items = await pipeline.getByStatus(status as any);
    return NextResponse.json(items);
  }
  if (q) {
    const items = await pipeline.search(q);
    return NextResponse.json(items);
  }

  const items = await pipeline.listAll();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const opportunity = await pipeline.create(body);
  return NextResponse.json(opportunity, { status: 201 });
}
