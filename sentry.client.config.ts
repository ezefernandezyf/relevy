import * as Sentry from "@sentry/nextjs";

/**
 * Client runtime Sentry init (REQ-20.1, design D7).
 *
 * DSN guard: without SENTRY_DSN the SDK stays disabled (`enabled: false`) and
 * nothing is captured or transmitted, so local dev/test remain no-op and never
 * throw. MVP scope note: SENTRY_DSN is a server-side env var, so this config
 * effectively activates in the browser only once a NEXT_PUBLIC_* DSN variable
 * is wired (deferred with source maps).
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.SENTRY_DSN,
});
