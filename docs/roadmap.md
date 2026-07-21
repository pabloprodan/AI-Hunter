# AI Hunter — Product Roadmap

## V1 — Freelancer Workspace (Current)

**Goal**: Replace manual freelancer workflows with an AI-powered pipeline.

### Done
- [x] Pipeline Manager (kanban, drag & drop, status transitions)
- [x] AI Scout (profile-aware opportunity discovery with match scoring)
- [x] Profile settings (skills, rates, platforms, keyword filtering)
- [x] Landing page (hero, features, pricing, waitlist)
- [x] Database layer (Drizzle ORM, SQLite, migraciones)
- [x] Testing (47 unit + 8 E2E, CI via GitHub Actions)
- [x] Brand identity (indigo-600, Inter, 4px grid)

### Next — V1.1
- [ ] Auth (Clerk or NextAuth) — Google/GitHub sign in
- [ ] Real user accounts (multi-tenant)
- [ ] Proposal generator — AI writes cover letters from profile
- [ ] Real job feed integration (RSS/API from Upwork, LinkedIn)
- [ ] Vercel deployment (NeonDB for Postgres)
- [ ] Stripe subscriptions (starter/pro/agency)

### V2 — AI Agent Layer
- [ ] Auto-apply agent — applies to matched opportunities autonomously
- [ ] Smart follow-ups — automated email/LinkedIn follow-ups
- [ ] Client scoring — predicts win probability from historical data
- [ ] Calendar integration — interview scheduling
- [ ] Chrome extension — one-click save from any job board

### V3 — Platform
- [ ] Team workspaces (agency mode)
- [ ] API for custom integrations
- [ ] Mobile app (React Native)
- [ ] Community marketplace — buy/sell leads

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | SQLite (dev) → Postgres/NeonDB (prod) | Zero-setup dev, scalable prod |
| Auth | Clerk | Social login, multi-tenant ready |
| Payments | Stripe | Subscription management, billing portal |
| Deployment | Vercel | Edge functions, serverless Postgres |
| AI | Anthropic/OpenAI API | Best-in-class proposal generation |
