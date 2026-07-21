import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  console.log(`[waitlist] signup: ${email}`);

  return NextResponse.json({ success: true, message: 'You\'re on the list!' });
}
