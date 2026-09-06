# Launch Lifestyle (launchfit.app)

Fitness coaching site for Keegan Marsden. Migrated from Replit in Sept 2026.
Read HANDOVER.md first - it has the deploy steps and the list of secrets.

## Stack
- Frontend: React 18 + Vite + Tailwind + shadcn/ui, code in `client/`. Routing via wouter.
- Backend: Express (TypeScript, ESM) in `server/`. Entry points:
  - `server/app.ts`  builds the Express app (shared by both hosts)
  - `server/index.ts` long-running server for local dev / a VPS
  - `api/index.ts`   Vercel serverless entry (wraps the same app)
- Database: Postgres via Drizzle. Schema in `shared/schema.ts`. `server/db.ts` picks the
  Neon serverless driver for Neon/Vercel Postgres URLs and plain `pg` for anything else.
- Scheduled emails: node-cron only runs on a long-lived server. On Vercel, `vercel.json`
  crons call `/api/cron/tri-weekly-email` (Mon/Wed/Fri 14:00 UTC) and
  `/api/cron/weekly-report` (Mon 09:00 UTC), guarded by `CRON_SECRET`.

## Commands
- `npm install`
- `npm run dev`            dev server on http://localhost:5000 (needs DATABASE_URL + OPENAI_API_KEY in .env)
- `npm run build`          builds the frontend to dist/public (this is what Vercel runs)
- `npm run build:server && npm start`   production bundle for a VPS
- `npm run db:push`        push schema changes with drizzle-kit
- `npm run db:restore`     load data/db-backup.sql into DATABASE_URL (fresh DB only)

## Things to know
- The app throws at import time if OPENAI_API_KEY is missing. Always set it.
- `DISABLE_ALL_EMAILS=true` silences every outbound email. Use it on preview deployments.
- Paystack and Stripe keys in the Replit export are LIVE keys. Real money.
- `attached_assets/` holds only the 10 images the code imports. The 800 MB of Replit
  chat uploads were deliberately dropped.
- Express also serves a few non-API HTML routes (/analytics-hub, /launch-hub, /unsubscribe,
  /payment-success ...). They are listed in vercel.json rewrites; add new ones there.
- The Firebase service account JSON is NOT in this repo. Provide it via
  GOOGLE_APPLICATION_CREDENTIALS (full JSON on one line) or drop service-account-key.json
  in the project root locally (git-ignored).
- In-memory state (conversation memory, integration monitor, setInterval jobs) does not
  persist between serverless invocations on Vercel. Everything that matters is in Postgres.
