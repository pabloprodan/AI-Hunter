import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Opportunity } from '@ai-hunter/types';

const DATA_DIR = join(process.cwd(), 'data');

function getProfile() {
  const path = join(DATA_DIR, 'profile.json');
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function getProposals(): Record<string, unknown>[] {
  const path = join(DATA_DIR, 'proposals.json');
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function saveProposal(proposal: Record<string, unknown>) {
  const path = join(DATA_DIR, 'proposals.json');
  const existing = getProposals();
  existing.push(proposal);
  writeFileSync(path, JSON.stringify(existing, null, 2));
}

function generateProposal(
  profile: { name: string; skills: string[] },
  opportunity: Partial<Opportunity>
): { subject: string; body: string } {
  const subject = `Re: ${opportunity.title} - ${profile.name}`;

  const skillLines = profile.skills
    .map((s) => `  - **${s}**`)
    .join('\n');

  const body = `Dear ${opportunity.clientName ?? 'Hiring Manager'},

I came across your opportunity "${opportunity.title}" and I am very excited to apply. With strong expertise in the following areas, I am confident I can deliver exceptional results:

${skillLines}

${opportunity.description ? `Your project involves: ${opportunity.description}\n\n` : ''}I have hands-on experience building production-grade applications using these technologies. I'm passionate about writing clean, maintainable code and delivering value quickly.

I would love to discuss how I can contribute to your project. Looking forward to hearing from you!

Best regards,
${profile.name}`;

  return { subject, body };
}

export async function POST(request: Request) {
  const { opportunityId, opportunity } = await request.json();

  if (!opportunityId || !opportunity?.title) {
    return NextResponse.json(
      { error: 'opportunityId and opportunity.title are required' },
      { status: 400 }
    );
  }

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  const profile = getProfile();

  const { subject, body } = generateProposal(profile, opportunity);

  const proposal = {
    id: `prop_${Date.now()}`,
    subject,
    body,
    opportunityId,
    createdAt: new Date().toISOString(),
  };

  saveProposal(proposal);

  return NextResponse.json({ proposal }, { status: 201 });
}
