import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type UserProfile = {
  name: string;
  skills: string[];
  hourlyRate: { min: number; max: number };
  platforms: string[];
  keywords: string[];
  excludedKeywords: string[];
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Freelancer',
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python'],
  hourlyRate: { min: 50, max: 150 },
  platforms: ['Upwork', 'LinkedIn', 'Fiverr', 'Toptal'],
  keywords: ['react', 'full stack', 'frontend', 'typescript', 'next.js'],
  excludedKeywords: ['wordpress', 'php', 'shopify', 'wix'],
};

export class ProfileStore {
  private path: string;

  constructor(dataDir: string) {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    this.path = join(dataDir, 'profile.json');
  }

  get(): UserProfile {
    if (!existsSync(this.path)) {
      writeFileSync(this.path, JSON.stringify(DEFAULT_PROFILE, null, 2));
      return { ...DEFAULT_PROFILE };
    }
    return JSON.parse(readFileSync(this.path, 'utf-8'));
  }

  update(profile: UserProfile): void {
    writeFileSync(this.path, JSON.stringify(profile, null, 2));
  }
}
