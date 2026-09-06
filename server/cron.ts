import type { Express, Request, Response, NextFunction } from "express";
import { sendWeeklyEmail } from "./emailScheduler";
import { sendWeeklyReport } from "./weekly-report";

/**
 * On Vercel there is no long-running process, so node-cron cannot fire.
 * vercel.json schedules HTTP calls to these endpoints instead. Vercel sends
 * `Authorization: Bearer <CRON_SECRET>` automatically when CRON_SECRET is set
 * in the project's environment variables.
 */
function requireCronSecret(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "CRON_SECRET is not configured" });
  }
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function registerCronRoutes(app: Express) {
  app.get("/api/cron/tri-weekly-email", requireCronSecret, async (_req, res) => {
    if (process.env.DISABLE_ALL_EMAILS === "true") {
      return res.json({ ok: true, skipped: "DISABLE_ALL_EMAILS=true" });
    }
    try {
      await sendWeeklyEmail();
      res.json({ ok: true, sent: "tri-weekly-email" });
    } catch (e: any) {
      console.error("tri-weekly-email cron failed:", e);
      res.status(500).json({ ok: false, error: e?.message });
    }
  });

  app.get("/api/cron/weekly-report", requireCronSecret, async (_req, res) => {
    if (process.env.DISABLE_ALL_EMAILS === "true") {
      return res.json({ ok: true, skipped: "DISABLE_ALL_EMAILS=true" });
    }
    try {
      const ok = await sendWeeklyReport();
      res.json({ ok, sent: "weekly-report" });
    } catch (e: any) {
      console.error("weekly-report cron failed:", e);
      res.status(500).json({ ok: false, error: e?.message });
    }
  });
}
