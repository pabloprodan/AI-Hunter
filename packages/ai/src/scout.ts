import type { Opportunity } from '@ai-hunter/types';
import { OpportunityMatcher } from './matcher';

const TEMPLATES = [
  {
    title: 'Senior React Developer',
    description: 'Build and maintain React-based dashboards for a fast-growing SaaS platform.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    budget: 8000,
    source: 'Upwork',
    clientName: 'TechSaaS Inc',
  },
  {
    title: 'Full Stack Developer',
    description: 'Looking for a full stack developer with Node.js and React experience.',
    skills: ['Node.js', 'React', 'MongoDB', 'GraphQL'],
    budget: 12000,
    source: 'LinkedIn',
    clientName: 'StartupXYZ',
  },
  {
    title: 'UI Engineer',
    description: 'Design and implement user interfaces for a fintech platform.',
    skills: ['Figma', 'React', 'Framer Motion', 'Storybook'],
    budget: 100,
    source: 'Toptal',
    clientName: 'FinFlow',
  },
  {
    title: 'React Native Developer',
    description: 'Develop cross-platform mobile app using React Native.',
    skills: ['React Native', 'TypeScript', 'Firebase', 'Expo'],
    budget: 15000,
    source: 'Upwork',
    clientName: 'MobileFirst',
  },
  {
    title: 'AI/ML Consultant',
    description: 'Develop and deploy machine learning models for predictive analytics.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS SageMaker'],
    budget: 200,
    source: 'Toptal',
    clientName: 'DataDriven Co',
  },
  {
    title: 'DevOps Contractor',
    description: 'Manage CI/CD pipelines, Kubernetes clusters, and infrastructure automation.',
    skills: ['Kubernetes', 'Terraform', 'Docker', 'AWS'],
    budget: 180,
    source: 'LinkedIn',
    clientName: 'CloudScale',
  },
  {
    title: 'GraphQL API Developer',
    description: 'Design and implement GraphQL APIs for a multi-service architecture.',
    skills: ['GraphQL', 'Node.js', 'Apollo', 'PostgreSQL'],
    budget: 11000,
    source: 'Upwork',
    clientName: 'ApiFirst',
  },
];

export class ScoutEngine {
  async scout(matcher: OpportunityMatcher): Promise<Opportunity[]> {
    const shuffled = [...TEMPLATES].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 3;
    const selected = shuffled.slice(0, count);

    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 6);
    return selected.map((t, i) => {
      const result = matcher.score(t);
      return {
        id: `scout-${ts}-${rand}-${i}`,
        title: t.title,
        source: t.source,
        url: `https://example.com/opportunity/${Date.now()}-${i}`,
        budget: t.budget,
        skills: t.skills,
        clientName: t.clientName,
        description: t.description,
        status: 'discovered' as const,
        matchScore: result.score,
        createdAt: new Date(),
      };
    });
  }
}
