import { NextResponse } from 'next/server';
import { join } from 'node:path';
import { ProfileStore } from '@ai-hunter/ai';

const store = new ProfileStore(join(process.cwd(), 'data'));

export async function GET() {
  return NextResponse.json(store.get());
}

export async function PUT(request: Request) {
  const body = await request.json();
  store.update(body);
  return NextResponse.json({ success: true, profile: body });
}
