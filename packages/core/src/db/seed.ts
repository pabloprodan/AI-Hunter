import { createDb } from './index';
import * as schema from './schema';
import { join } from 'node:path';

const DB_PATH = join(import.meta.dirname, '..', '..', '..', '..', 'data', 'ai-hunter.db');

async function main() {
  const db = createDb(DB_PATH);

  const existing = await db.select().from(schema.opportunities).limit(1);
  if (existing.length > 0) {
    console.log('Database already seeded, skipping');
    return;
  }

  const now = new Date();
  await db.insert(schema.opportunities).values([
    { id: '1', title: 'Senior React Developer', source: 'Upwork', url: 'https://upwork.com/job/1', budget: 8000, skills: ['React', 'TypeScript', 'Next.js'], clientName: 'TechCorp', description: 'Looking for a senior React developer to build a SaaS dashboard.', status: 'interviewing', matchScore: 95, createdAt: new Date(now.getTime() - 3 * 86400000).toISOString() },
    { id: '2', title: 'Full Stack Freelancer', source: 'LinkedIn', url: 'https://linkedin.com/job/2', budget: 100, skills: ['Node.js', 'React', 'PostgreSQL'], clientName: 'StartupXYZ', description: 'Need a full stack developer for a 3-month contract.', status: 'applied', matchScore: 92, createdAt: new Date(now.getTime() - 2 * 86400000).toISOString() },
    { id: '3', title: 'Next.js E-commerce Build', source: 'Fiverr', url: 'https://fiverr.com/job/3', budget: 3000, skills: ['Next.js', 'Tailwind', 'Stripe'], clientName: 'FashionStore', description: 'Build a modern e-commerce store with Next.js.', status: 'discovered', matchScore: 88, createdAt: new Date(now.getTime() - 1 * 86400000).toISOString() },
    { id: '4', title: 'AI Chatbot Integration', source: 'Toptal', url: 'https://toptal.com/job/4', budget: 15000, skills: ['Python', 'OpenAI', 'FastAPI'], clientName: 'HealthTech Inc', description: 'Integrate GPT-powered chatbot into healthcare platform.', status: 'qualified', matchScore: 85, createdAt: new Date(now.getTime() - 2 * 86400000).toISOString() },
    { id: '5', title: 'Mobile App UI Redesign', source: 'Upwork', url: 'https://upwork.com/job/5', budget: 6000, skills: ['Figma', 'React Native', 'UI/UX'], clientName: 'FinApp', description: 'Redesign the mobile app UI for a fintech startup.', status: 'discovered', matchScore: 78, createdAt: new Date(now.getTime() - 1 * 86400000).toISOString() },
    { id: '6', title: 'GraphQL API Migration', source: 'LinkedIn', url: 'https://linkedin.com/job/6', budget: 12000, skills: ['GraphQL', 'Node.js', 'Apollo'], clientName: 'DataFlow', description: 'Migrate REST API to GraphQL.', status: 'won', matchScore: 91, createdAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
    { id: '7', title: 'WordPress Speed Optimization', source: 'Fiverr', url: 'https://fiverr.com/job/7', budget: 500, skills: ['WordPress', 'PHP', 'Performance'], clientName: 'BlogMaster', description: 'Optimize WordPress site for Core Web Vitals.', status: 'lost', matchScore: 72, createdAt: new Date(now.getTime() - 6 * 86400000).toISOString() },
  ]);

  console.log('Seeded 7 opportunities');
}

main().catch(console.error);
