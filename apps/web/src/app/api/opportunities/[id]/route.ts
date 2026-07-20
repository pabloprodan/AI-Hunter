import { NextResponse } from 'next/server';
import { JsonStore, PipelineService } from '@ai-hunter/core';
import { join } from 'node:path';

const store = new JsonStore(join(process.cwd(), 'data'));
const pipeline = new PipelineService(store);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const opportunity = await pipeline.update(id, body);
  return NextResponse.json(opportunity);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await pipeline.delete(id);
  return NextResponse.json({ success: true });
}
