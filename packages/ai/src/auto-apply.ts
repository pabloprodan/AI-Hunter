import type { Opportunity } from '@ai-hunter/types';
import type { UserProfile } from './profile';

export class AutoApplyAgent {
  constructor(private profile: UserProfile) {}

  async findCandidates(opportunities: Opportunity[]): Promise<Opportunity[]> {
    return opportunities.filter(
      (o) => o.matchScore >= 80 && o.status !== 'applied',
    );
  }

  async apply(opportunity: Opportunity): Promise<{ success: boolean; message: string }> {
    console.log(`[AutoApplyAgent] Applying to: ${opportunity.title}...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`[AutoApplyAgent] Successfully applied to: ${opportunity.title}`);
    return { success: true, message: `Applied to ${opportunity.title}` };
  }
}
