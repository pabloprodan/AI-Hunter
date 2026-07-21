import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const opportunities = sqliteTable('opportunities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  source: text('source').notNull(),
  url: text('url').notNull(),
  budget: real('budget'),
  skills: text('skills', { mode: 'json' }).$type<string[]>().notNull().default([]),
  clientName: text('client_name'),
  description: text('description').notNull().default(''),
  status: text('status', { enum: ['discovered', 'qualified', 'applied', 'interviewing', 'won', 'lost'] }).notNull().default('discovered'),
  matchScore: integer('match_score').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  skills: text('skills', { mode: 'json' }).$type<string[]>().notNull().default([]),
  hourlyRateMin: integer('hourly_rate_min').notNull().default(50),
  hourlyRateMax: integer('hourly_rate_max').notNull().default(150),
  platforms: text('platforms', { mode: 'json' }).$type<string[]>().notNull().default([]),
  keywords: text('keywords', { mode: 'json' }).$type<string[]>().notNull().default([]),
  excludedKeywords: text('excluded_keywords', { mode: 'json' }).$type<string[]>().notNull().default([]),
});
