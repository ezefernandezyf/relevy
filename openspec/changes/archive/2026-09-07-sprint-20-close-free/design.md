# Design: Sprint 20 — Close Free

## Technical Approach

Four atomic work units closing the FREE plan: Sentry MVP (manual Next.js 15+ setup), final brand (og.png + starter-SVG removal), honest landing launch section, cleanups + live-docs sync. Maps to 9 requirements/28 scenarios. Review budget ~430-480 lines > 400 → chained PRs (3 slices) via feature-branch-chain (tracker=develop, integrate by tip, never squash mid-chain — D8).

## Architecture Decisions

- **Sentry pin & setup**: exact pin `@sentry/nextjs@10.73.0` (no ^/~), manual setup (3 runtime configs) because middleware.ts is Edge; wizard rejected (generates client-only passthroughs + sourcemap upload needing SENTRY_AUTH_TOKEN). Source maps omitted in MVP.
- **withSentryConfig import**: from `@sentry/nextjs/config` (v10 moved it; main-entry re-export is @deprecated).
- **CSP location**: `next.config.ts` headers() `:16-57` — change is 1 directive (`connect-src` += `https://*.ingest.sentry.io`), not layout.tsx.
- **og.png**: manual SVG→PNG by user (no committed script/tool dep), asserted by tests (exists, 1200×630, hash != pre-rebrand default 9e854ba0…).
- **Lighthouse**: remove (user decision), not repair.
- **Docs volume**: chained 3 slices.

## Data Flow

instrumentation.ts register() → NEXT_RUNTIME nodejs→sentry.server.config / edge→sentry.edge.config; onRequestError = Sentry.captureRequestError. next.config.ts wrapped with withSentryConfig preserves headers(). DSN guard: Sentry.init({ dsn, enabled: !!dsn }) — no DSN → enabled false, no throw.

## File Changes (key)

Create: sentry.{client,server,edge}.config.ts, instrumentation.ts. Modify: next.config.ts, package.json (+@sentry/nextjs 10.73.0 exact, −lighthouse devDep+script), .env.example (+SENTRY_DSN), src/lib/copy.ts (+LANDING_COPY.launch), src/app/page.tsx (launch section FAQ→CTA), README/AGENTS/config.yaml/pnpm-workspace/ci.yml/performance.md/SPRINT-ROADMAP.md, lockfile. Delete: 5 starter SVGs, public/fonts/ (5 TTFs), scripts/lighthouse.mjs. Replace: public/og.png. Add-track: docs/RELEVY-BRAND-BRIEF.md.

## Testing (strict TDD, RED first)

Sentry: exact dep, 4 files exist, register+onRequestError exported, no-op without DSN, init with mocked DSN (vi.mock). Config: wrapped + headers preserve 6 security headers + connect-src ingest. Brand: og.png 1200×630 hash differs, SVGs/TTFs absent 0 refs. Landing: launch section order + copy 50-200w neutral. Perf/docs: no lighthouse/puppeteer-core, grep GeoAudit=0.

## Threat Matrix

N/A — no routing/shell/subprocess/VCS-PR/executable-classification/process-integration boundary.

## Rollout

No migration; per-area git revert. Sentry additive; source maps deferred until SENTRY_AUTH_TOKEN provisioned.

## Open Questions

- Visual confirm of regenerated og.png (human check vs icon.svg) — recorded in verify.
- None blocking: Sentry slugs+DSN are env-only (Vercel).
