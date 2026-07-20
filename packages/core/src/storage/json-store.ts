import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Opportunity, OpportunityStatus } from '@ai-hunter/types';
import type { StorageAdapter } from './interface';

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    source: 'Upwork',
    url: 'https://upwork.com/job/1',
    budget: 8000,
    skills: ['React', 'TypeScript', 'Next.js'],
    clientName: 'TechCorp',
    description: 'Looking for a senior React developer to build a SaaS dashboard.',
    status: 'interviewing',
    matchScore: 95,
    createdAt: new Date('2026-07-18'),
  },
  {
    id: '2',
    title: 'Full Stack Freelancer',
    source: 'LinkedIn',
    url: 'https://linkedin.com/job/2',
    budget: 100,
    skills: ['Node.js', 'React', 'PostgreSQL'],
    clientName: 'StartupXYZ',
    description: 'Need a full stack developer for a 3-month contract.',
    status: 'applied',
    matchScore: 92,
    createdAt: new Date('2026-07-19'),
  },
  {
    id: '3',
    title: 'Next.js E-commerce Build',
    source: 'Fiverr',
    url: 'https://fiverr.com/job/3',
    budget: 3000,
    skills: ['Next.js', 'Tailwind', 'Stripe'],
    clientName: 'FashionStore',
    description: 'Build a modern e-commerce store with Next.js.',
    status: 'discovered',
    matchScore: 88,
    createdAt: new Date('2026-07-20'),
  },
  {
    id: '4',
    title: 'AI Chatbot Integration',
    source: 'Toptal',
    url: 'https://toptal.com/job/4',
    budget: 15000,
    skills: ['Python', 'OpenAI', 'FastAPI'],
    clientName: 'HealthTech Inc',
    description: 'Integrate GPT-powered chatbot into healthcare platform.',
    status: 'qualified',
    matchScore: 85,
    createdAt: new Date('2026-07-19'),
  },
  {
    id: '5',
    title: 'Mobile App UI Redesign',
    source: 'Upwork',
    url: 'https://upwork.com/job/5',
    budget: 6000,
    skills: ['Figma', 'React Native', 'UI/UX'],
    clientName: 'FinApp',
    description: 'Redesign the mobile app UI for a fintech startup.',
    status: 'discovered',
    matchScore: 78,
    createdAt: new Date('2026-07-20'),
  },
  {
    id: '6',
    title: 'GraphQL API Migration',
    source: 'LinkedIn',
    url: 'https://linkedin.com/job/6',
    budget: 12000,
    skills: ['GraphQL', 'Node.js', 'Apollo'],
    clientName: 'DataFlow',
    description: 'Migrate REST API to GraphQL.',
    status: 'won',
    matchScore: 91,
    createdAt: new Date('2026-07-17'),
  },
  {
    id: '7',
    title: 'WordPress Speed Optimization',
    source: 'Fiverr',
    url: 'https://fiverr.com/job/7',
    budget: 500,
    skills: ['WordPress', 'PHP', 'Performance'],
    clientName: 'BlogMaster',
    description: 'Optimize WordPress site for Core Web Vitals.',
    status: 'lost',
    matchScore: 72,
    createdAt: new Date('2026-07-16'),
  },
];

export class JsonStore implements StorageAdapter {
  private path: string;
  private cache: Opportunity[] | null = null;

  constructor(dataDir: string) {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    this.path = join(dataDir, 'opportunities.json');
    this.init();
  }

  private init() {
    if (!existsSync(this.path)) {
      writeFileSync(this.path, JSON.stringify(DEFAULT_OPPORTUNITIES, null, 2));
    }
  }

  private read(): Opportunity[] {
    if (this.cache) return this.cache;
    const raw = readFileSync(this.path, 'utf-8');
    this.cache = JSON.parse(raw).map((o: any) => ({ ...o, createdAt: new Date(o.createdAt) }));
    return this.cache!;
  }

  private write(data: Opportunity[]) {
    this.cache = data;
    writeFileSync(this.path, JSON.stringify(data, null, 2));
  }

  async list() {
    return this.read();
  }

  async getById(id: string) {
    const data = this.read();
    return data.find((o) => o.id === id) ?? null;
  }

  async create(input: Omit<Opportunity, 'id' | 'createdAt'>) {
    const data = this.read();
    const opportunity: Opportunity = {
      ...input,
      id: String(Date.now()),
      createdAt: new Date(),
    };
    data.push(opportunity);
    this.write(data);
    return opportunity;
  }

  async update(id: string, input: Partial<Opportunity>) {
    const data = this.read();
    const index = data.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Opportunity ${id} not found`);
    data[index] = { ...data[index], ...input };
    this.write(data);
    return data[index];
  }

  async delete(id: string) {
    const data = this.read();
    const filtered = data.filter((o) => o.id !== id);
    if (filtered.length === data.length) throw new Error(`Opportunity ${id} not found`);
    this.write(filtered);
  }
}
