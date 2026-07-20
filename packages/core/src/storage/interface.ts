import type { Opportunity } from '@ai-hunter/types';

export interface StorageAdapter {
  list(): Promise<Opportunity[]>;
  getById(id: string): Promise<Opportunity | null>;
  create(data: Omit<Opportunity, 'id' | 'createdAt'>): Promise<Opportunity>;
  update(id: string, data: Partial<Opportunity>): Promise<Opportunity>;
  delete(id: string): Promise<void>;
}
