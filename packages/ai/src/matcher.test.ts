import { describe, it, expect } from 'vitest';
import { OpportunityMatcher } from './matcher';
import type { UserProfile } from './profile';

const profile: UserProfile = {
  name: 'Test',
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
  hourlyRate: { min: 50, max: 150 },
  platforms: ['Upwork', 'Toptal'],
  keywords: ['react', 'full stack', 'frontend'],
  excludedKeywords: ['wordpress', 'php', 'shopify'],
};

describe('OpportunityMatcher', () => {
  it('scores 40 when all skills match', () => {
    const m = new OpportunityMatcher(profile);
    const result = m.score({
      title: 'React Dev',
      description: 'Need a frontend developer',
      skills: ['React', 'TypeScript'],
      source: 'Upwork',
    });
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.matchedSkills).toEqual(['React', 'TypeScript']);
  });

  it('scores 0 when nothing matches', () => {
    const m = new OpportunityMatcher(profile);
    const result = m.score({
      title: 'COBOL Programmer',
      description: 'Mainframe maintenance',
      skills: ['COBOL', 'JCL'],
      source: 'Fiverr',
    });
    expect(result.score).toBe(0);
    expect(result.matchedSkills).toEqual([]);
  });

  it('reduces score for excluded keywords', () => {
    const m = new OpportunityMatcher(profile);
    const result = m.score({
      title: 'WordPress Developer',
      description: 'Build custom WordPress theme',
      skills: ['PHP', 'WordPress'],
      source: 'Upwork',
    });
    expect(result.score).toBeLessThanOrEqual(20);
    expect(result.reasoning).toContain('-50');
  });

  it('gives platform match bonus', () => {
    const m = new OpportunityMatcher(profile);
    const result = m.score({
      title: 'Random Job',
      description: 'Some work',
      skills: [],
      source: 'Upwork',
    });
    expect(result.score).toBeGreaterThanOrEqual(15);
    expect(result.reasoning).toContain('+15');
  });

  it('caps score at 100', () => {
    const m = new OpportunityMatcher(profile);
    const result = m.score({
      title: 'Senior React Full Stack Developer Frontend',
      description: 'Need a full stack developer with React Node.js TypeScript Next.js',
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
      budget: 100,
      source: 'Toptal',
    });
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('detects missing skills', () => {
    const m = new OpportunityMatcher(profile);
    const result = m.score({
      title: 'Rust Systems Engineer',
      description: 'Systems programming',
      skills: ['Rust', 'React'],
      source: 'LinkedIn',
    });
    expect(result.missingSkills).toContain('Rust');
    expect(result.matchedSkills).toContain('React');
  });
});
