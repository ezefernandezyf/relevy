import * as Sentry from "@sentry/nextjs";

/**
 * Node.js runtime Sentry init (REQ-20.1, design D7) — loaded by
 * instrumentation.ts `register()` when NEXT_RUNTIME is "nodejs".
 *
 * DSN guard: without SENTRY_DSN the SDK stays disabled (`enabled: false`) and
 * nothing is captured or transmitted, so local dev/test remain no-op and never
 * throw. Source maps are deferred until SENTRY_AUTH_TOKEN + slugs exist.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
});
