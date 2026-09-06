import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";
import { initializeWeeklyEmails } from "./emailScheduler";

(async () => {
  const { app, server } = await createApp();

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`Server ready on port ${port}`);
    log(`Environment: ${process.env.NODE_ENV || "development"}`);
    try {
      initializeWeeklyEmails();
      log("Email scheduler initialized (in-process cron)");
    } catch (e) {
      console.error("Email scheduler failed to initialize:", e);
    }
  });
})();
