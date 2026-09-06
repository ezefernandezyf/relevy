import * as Sentry from "@sentry/nextjs";

/**
 * Edge runtime Sentry init (REQ-20.1, design D7) — required because
 * `src/middleware.ts` runs on the Edge runtime; loaded by instrumentation.ts
 * `register()` when NEXT_RUNTIME is "edge".
 *
 * DSN guard: without SENTRY_DSN the SDK stays disabled (`enabled: false`) and
 * nothing is captured or transmitted, so local dev/test remain no-op and never
 * throw.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
});
