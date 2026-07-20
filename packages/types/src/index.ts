export type Opportunity = {
  id: string;
  title: string;
  source: string;
  url: string;
  budget?: number;
  skills: string[];
  clientName?: string;
  description: string;
  status: OpportunityStatus;
  matchScore: number;
  createdAt: Date;
};

export type OpportunityStatus =
  | 'discovered'
  | 'qualified'
  | 'applied'
  | 'interviewing'
  | 'won'
  | 'lost';

export type Pipeline = {
  id: string;
  name: string;
  opportunities: Opportunity[];
  metrics: PipelineMetrics;
};

export type PipelineMetrics = {
  total: number;
  won: number;
  lost: number;
  conversionRate: number;
  averageDealSize: number;
};

export type UserProfile = {
  id: string;
  name: string;
  skills: string[];
  rates: RateCard[];
  preferences: UserPreferences;
};

export type RateCard = {
  service: string;
  hourly: number;
  fixed: number;
};

export type UserPreferences = {
  platforms: string[];
  minBudget: number;
  maxBudget: number;
  keywords: string[];
  excludedKeywords: string[];
};
