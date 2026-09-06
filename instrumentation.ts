import * as Sentry from "@sentry/nextjs";

/**
 * Next.js 15+ instrumentation (REQ-20.1, design D7, manual Sentry setup).
 *
 * `register()` runs once per server instance in both the Node.js and the Edge
 * runtime; it loads the matching runtime config (server for "nodejs", edge for
 * "edge"). Outside a Next runtime (vitest, plain scripts) NEXT_RUNTIME is
 * unset and nothing is loaded — dev/test stay no-op.
 *
 * `onRequestError` captures errors from Server Components, route handlers,
 * middleware and proxies via the SDK helper.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
