import type { UserProfile } from './profile';

export type MatchResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
};

export type ScoutOpportunity = {
  title: string;
  description: string;
  skills: string[];
  budget?: number;
  source: string;
};

export class OpportunityMatcher {
  constructor(private profile: UserProfile) {}

  score(opportunity: ScoutOpportunity): MatchResult {
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of opportunity.skills) {
      const profileSkill = this.profile.skills.find(
        (s) => s.toLowerCase() === skill.toLowerCase(),
      );
      if (profileSkill) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const text = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    const hasKeyword = this.profile.keywords.some((k) => text.includes(k.toLowerCase()));
    const hasExcluded = this.profile.excludedKeywords.some((k) => text.includes(k.toLowerCase()));
    const hasPlatform = this.profile.platforms.includes(opportunity.source);

    const inBudget =
      opportunity.budget != null &&
      opportunity.budget >= this.profile.hourlyRate.min &&
      opportunity.budget <= this.profile.hourlyRate.max;

    let score = 0;
    const reasons: string[] = [];

    if (matchedSkills.length > 0) {
      const skillScore = Math.min(40, (matchedSkills.length / opportunity.skills.length) * 40);
      score += skillScore;
      reasons.push(`+${skillScore.toFixed(0)} skills`);
    }

    if (hasKeyword) {
      score += 25;
      reasons.push('+25 keyword');
    }

    if (inBudget) {
      score += 20;
      reasons.push('+20 budget');
    }

    if (hasPlatform) {
      score += 15;
      reasons.push('+15 platform');
    }

    if (hasExcluded) {
      score = Math.max(0, score - 50);
      reasons.push('-50 excluded keyword');
    }

    return {
      score: Math.min(100, Math.round(score)),
      matchedSkills,
      missingSkills,
      reasoning: reasons.join(', ') || 'No match criteria met',
    };
  }
}
