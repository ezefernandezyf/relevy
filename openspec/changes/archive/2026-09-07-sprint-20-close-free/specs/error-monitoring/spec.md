# Error Monitoring Specification

> **Change**: `sprint-20-close-free` · **Type**: New capability (ADDED)

## Purpose

Real-time error monitoring for the Relevy app via Sentry. The app previously relied only on Vercel logs; this change adds a Sentry MVP with a no-op guard so the app boots cleanly without a DSN, plus a Content-Security-Policy (CSP) `connect-src` entry that allows Sentry's ingest endpoint. Source map upload is intentionally omitted for the MVP (no `SENTRY_AUTH_TOKEN` provisioned).

## Requirements

| # | Requirement | Status | Strength | Summary |
|---|-------------|--------|----------|---------|
| REQ-20.1 | Sentry SDK setup | ADDED | MUST | `@sentry/nextjs` pinned exact in dependencies; manual setup files present; `withSentryConfig` preserves `headers()`; no-op guard without DSN; initializes when DSN is set; source maps omitted (MVP) |
| REQ-20.2 | CSP connect-src | ADDED | MUST | `connect-src` includes `https://*.ingest.sentry.io` keeping `'self'`; header stays Report-Only; remaining directives intact |

### Requirement: Sentry SDK Setup (REQ-20.1)

When the app runs with error monitoring enabled, then Sentry MUST be set up as an MVP with a no-op guard: `@sentry/nextjs` pinned exactly in `dependencies` (no `^`/`~`); manual setup files present (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts` exporting `register` + `onRequestError`); `withSentryConfig` wrapping `next.config.ts` preserving the security `headers()`; `SENTRY_DSN` with a no-op guard (no DSN → Sentry not initialized, no error thrown); source maps omitted (MVP, no `SENTRY_AUTH_TOKEN`); `.env.example` documents optional `SENTRY_DSN`.

#### Scenario: SDK pinned in dependencies

- GIVEN `package.json`
- WHEN the dependencies are inspected
- THEN `@sentry/nextjs` is present pinned exactly (no `^`/`~` prefix)

#### Scenario: Manual setup files present

- GIVEN the repository
- WHEN the Sentry config files are inspected
- THEN `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and `instrumentation.ts` exist
- AND `instrumentation.ts` exports `register` and `onRequestError`

#### Scenario: Security headers preserved under withSentryConfig

- GIVEN `next.config.ts`
- WHEN it is wrapped with `withSentryConfig`
- THEN the `headers()` function still emits the security headers (CSP Report-Only, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)

#### Scenario: No-op guard without DSN

- GIVEN the app with no `SENTRY_DSN`
- WHEN it boots
- THEN Sentry is not initialized (`enabled: !!dsn` → false) and no error is thrown

#### Scenario: Initializes when DSN is set

- GIVEN the app with a `SENTRY_DSN`
- WHEN it boots
- THEN `Sentry.init` is called with that DSN

#### Scenario: Source maps omitted (MVP)

- GIVEN the Sentry setup
- WHEN the build/upload configuration is inspected
- THEN no source map upload is configured (no `SENTRY_AUTH_TOKEN` required)

### Requirement: CSP connect-src (REQ-20.2)

When the app serves its security headers, then the CSP MUST allow Sentry's ingest endpoint: `connect-src` adds `https://*.ingest.sentry.io` while keeping `'self'`; the header remains Report-Only; the remaining directives stay intact.

#### Scenario: connect-src allows Sentry ingest

- GIVEN the CSP header
- WHEN `connect-src` is inspected
- THEN it includes `'self'` and `https://*.ingest.sentry.io`

#### Scenario: Report-only mode and directives preserved

- GIVEN the CSP header
- WHEN it is inspected
- THEN the header is `Content-Security-Policy-Report-Only`
- AND the other directives are unchanged

## Compliance Matrix

| Requirement | Scenarios | Coverage |
|-------------|-----------|----------|
| REQ-20.1 | SDK pinned in dependencies, Manual setup files present, Security headers preserved under withSentryConfig, No-op guard without DSN, Initializes when DSN is set, Source maps omitted (MVP) | Covered |
| REQ-20.2 | connect-src allows Sentry ingest, Report-only mode and directives preserved | Covered |
