import { NextResponse } from 'next/server';
import { fetchFeed, parseRSS, getFeedSources } from '@ai-hunter/ai';

export async function GET() {
  const sources = getFeedSources();
  return NextResponse.json({ sources });
}

export async function POST(request: Request) {
  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    const xml = await fetchFeed(url);
    const items = parseRSS(xml);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 502 });
  }
}
