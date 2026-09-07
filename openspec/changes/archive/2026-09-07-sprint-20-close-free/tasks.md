# Tasks: Sprint 20 — Close Free

## Review Workload Forecast

Estimado ~780-880 líneas (S1 ~260 · S2 ~170 · S3 ~400). Delivery: ask-on-risk.

```text
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High
```

### Suggested Work Units

| Unit | Goal | PR / base | Focused test | Harness | Rollback |
|------|------|-----------|--------------|---------|----------|
| 1 | Sentry MVP | PR 1 · develop · `feat/sprint-20-close-free-pr1-sentry` | `pnpm vitest run src/lib/__tests__/sentry-config.test.ts` | `pnpm dev` sin DSN (no-op, sin throw) | 3 configs + instrumentation + wrap + package.json |
| 2 | Brand+landing | PR 2 · PR1 branch · `feat/sprint-20-close-free-pr2-brand-landing` | `pnpm vitest run src/lib/__tests__/{og,public-assets,copy}.test.ts src/app/__tests__/page.test.tsx` | `pnpm dev` — launch FAQ→CTA; og.png vs icon.svg | copy/page + SVGs + og.png |
| 3 | Cleanup+docs | PR 3 · PR2 branch · `feat/sprint-20-close-free-pr3-cleanup-docs` | `pnpm vitest run src/lib/__tests__/repo-hygiene.test.ts` | `pnpm install` poda; `pnpm test`; lint/typecheck | package.json, scripts/, fonts/, 7 docs, brief |

Tracker = develop; sin squash mid-chain.

## Phase 1: Sentry — PR 1 (8 esc.)

- [x] **T1 — Setup (REQ-20.1)** — RED `src/lib/__tests__/sentry-config.test.ts`: pin exacto `@sentry/nextjs` en deps (sin `^`/`~`); existen 3 configs + `instrumentation.ts` con `register`/`onRequestError`. GREEN: `pnpm add @sentry/nextjs@10.73.0 --save-exact`; 3 configs `init({ dsn, enabled: !!dsn })`; `instrumentation.ts` (`register()` nodejs/edge, `onRequestError = captureRequestError`).
- [x] **T2 — Guard + CSP (REQ-20.1/2)** — RED (mismo): sin DSN → `vi.mock` `init` NO llamado, sin throw; DSN mock → `init` con ese DSN; wrap `withSentryConfig` (headers intactos, `connect-src` += ingest); sin sourcemaps. GREEN: wrap + `.env.example` + `SENTRY_DSN`. Commit: `feat(monitoring): add Sentry error tracking`.

## Phase 2: Brand + landing — PR 2 (9 esc.)

- [x] **T3 — Launch (LND-20.1)** — RED: `copy.test.ts` — `LANDING_COPY.launch` 50-200w, pasa `VOSEO_PATTERN`, "10 auditorías"/"30 días", sin claims pago; `page.test.tsx` — FAQ→launch→CTA + tokens (`font-serif`, navy). GREEN: `copy.ts` +launch; `page.tsx` +section entre FAQ y CTA (L787/789). Commit: `feat(landing): add launch section`. ✅ hecho en `00db571` (commit combinado con T4 asserts+SVGs).
- [x] **T4 — og.png + SVGs (LND-8, LND-20.2)** — RED: `og.test.ts` +hash ≠ `9e854ba0…`; nuevo `public-assets.test.ts` — 5 SVGs ausentes + 0 refs. GREEN: **manual** — regenerar `public/og.png` SVG→PNG 1200×630 mark `icon.svg` (Inkscape/rsvg/Figma; visual en verify); `git rm public/{next,vercel,window,globe,file}.svg`. Commit: `chore(brand): refresh og image and remove starter assets`.
  > **✅ COMPLETO (slice 3 verificado)**: el usuario regeneró `public/og.png` (hash `d72d1f8…`, idéntico en working tree y tip PR2 `0293347`) — el test de hash quedó GREEN en la suite completa del PR3 (1106 passed).

## Phase 3: Cleanup + docs — PR 3 (11 esc.)

- [x] **T5 — Lighthouse + fonts (PERF-1, REQ-20.3)** — RED nuevo `repo-hygiene.test.ts`: sin devDep/script/`scripts/lighthouse.mjs`; `public/fonts/` vacío; 0 refs TTFs; lockfile sin `puppeteer-core`; `performance.md` conserva 2026-08-25. GREEN: `package.json` −lighthouse; `git rm scripts/lighthouse.mjs public/fonts/`; `pnpm install` poda (commit aparte); `performance.md` update. Commits: `chore(deps): remove lighthouse and prune lockfile` + `chore(deps): prune lockfile orphans (W-2)`. ✅ hecho en `0c416eb` (commit único: poda W-2 incluida — lockfile −751 líneas, 0 añadidas, solo transitivas de lighthouse/puppeteer-core).
- [x] **T6 — Docs + brief (REQ-20.4, REQ-20.5)** — RED (mismo): grep "GeoAudit" = 0 en 7 docs; README sin Resend/PDF/Puppeteer + Sentry + pesos v3.1.0 (sin v2.0.0) + free 10/30d; AGENTS sin "PDF: Puppeteer"; config Relevy, workspace sin `puppeteer`; roadmap `296c719` (#84); brief tracked + consistente con `brand.ts`. GREEN: sync 7 docs; track brief. Commits: `chore(docs): sync brand and claims` + `chore(sdd): mark sprint-20 tasks complete`. ✅ docs en `607dcc3`, brief en `9b8d0c8` (commit `docs(brand)` aparte per orchestrator; sin commit de tasks.md — los marks viven en working tree de `feat/sprint-20-close-free`).
- [x] **T7 — Gate** — `pnpm test` (1106 passed/4 skipped) · lint clean · typecheck clean · format (lint-staged en T6). `pnpm dev` smoke queda para verify (convención: no build en apply). ✅ suite completa 118 files · 1106 passed · 4 skipped.

> **Nota de reconciliación (archive)**: los checkboxes T1-T7 se marcan `[x]` en este `tasks.md` al momento del archive. El `tasks.md` físico del tracker conservaba T4-T7 sin `[x]` por instrucción del orquestador (la marcación se difirió a archive — SUGGESTION 1 del verify). El apply-progress (Engram #1919) y el verify-report (PASS) confirman T1-T7 completos. Esta reconciliación de checkboxes stale está aprobada explícitamente por el orquestador, respaldada por apply-progress + verify-report.
