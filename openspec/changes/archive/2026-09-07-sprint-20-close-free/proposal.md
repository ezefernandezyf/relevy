# Proposal: Sprint 20 — Close Free

## Intent

Cerrar el plan FREE: monitoreo real (hoy solo logs de Vercel), marca final (og.png pre-rebrand; docs "GeoAudit"), anuncio honesto en landing, limpieza W-1..W-3. README stale (claims falsos: PDF, Resend, Sentry, pesos v2.0.0). Lighthouse ROTO desde sprint 18 → remover (decisión usuario).

## Scope

### In Scope
1. **Sentry MVP** — `@sentry/nextjs` (pin), setup manual Next 15 + Turbopack: `sentry.{client,server,edge}.config.ts` + `instrumentation.ts` (`register()` + `onRequestError`) + `withSentryConfig` (preservar `headers()`). DSN con guard no-op; `.env.example` documenta. CSP `connect-src` += `*.ingest.sentry.io`. Sin source maps.
2. **Brand final** — `public/og.png` regenerado con mark Relevy (manual, ref. `icon.svg`; OG ya usa `/og.png`). Remover 5 SVGs starter sin consumidor. Sync "GeoAudit" → "Relevy" en docs vivos (config, workspace, ci.yml, roadmap, performance.md). Commit `docs/RELEVY-BRAND-BRIEF.md`.
3. **Landing launch** — sección announce honesta (plan FREE, 10 audits/30 días), design system existente, copy ES neutral, sin inventos. Posts externos: del usuario, NO implementar.
4. **Limpiezas** — remover `lighthouse` devDep + script + `scripts/lighthouse.mjs` + refs. `pnpm install` poda orphans (`puppeteer-core@25.8.0`). Remover `public/fonts/` (5 TTFs). Remote `geoaudit.git` → `relevy.git` (manual). Roadmap stale (`296c719`).

### Out of Scope
Monetización; posts externos; reparar lighthouse; engine/JSON-LD sprint 19; mobile-menu; tests; briefs históricos.

## Capabilities

### New Capabilities
- `error-monitoring`: REQ-20.x SDK Sentry + configs + instrumentation + guard DSN + CSP ingest

### Modified Capabilities
- `landing-page`: ADDED REQ-20.x sección launch honesta (banda 50-200); og.png de marca (LND-8)
- `performance`: MODIFIED PERF-1 — tooling Lighthouse removido; medición documentada

## Approach

1. Setup manual Sentry; TDD con DSN mockeado.
2. og.png manual; grep "GeoAudit" = 0 en docs vivos.
3. Sección launch como componente propio (patrón LND-16/17, copy en `copy.ts`).
4. `pnpm install` poda (commit aparte); lighthouse fuera.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `package.json`, `next.config.ts` | Modified | +sentry; −lighthouse; wrap |
| `sentry.*.config.ts`, `instrumentation.ts` | New | 4 archivos |
| `.env.example` | Modified | +SENTRY_DSN |
| `public/` (og.png, fonts/, *.svg) | Mod/Removed | marca + limpieza |
| `src/app/page.tsx`, `src/ui/` | Modified | sección launch |
| Docs vivos + README + AGENTS | Modified | sync marca + claims |
| `scripts/lighthouse.mjs` | Removed | W-1 |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Sentry + Turbopack incompat | Med | pin estable + setup doc |
| Volumen docs >400 líneas | Med | chained PRs (3 slices) |
| og.png manual | Low | verificación visual + revert |
| `pnpm install` toca node_modules | Low | commit aparte |

## Rollback Plan

`git revert` por área (levers independientes); Sentry sin migraciones; og.png/docs reversibles.

## Dependencies

- DSN Sentry (env Vercel); verificación visual og.png.

## Success Criteria

- [ ] Sentry captura un error real en prod
- [ ] lint + format + test green
- [ ] grep "GeoAudit" = 0 en docs vivos (excl. briefs históricos)
- [ ] Lock sin `puppeteer-core`; sin script `lighthouse`
- [ ] Landing con launch honesto; og.png = mark Relevy

## Review Workload Forecast

- Líneas: ~430-480 (Sentry 160, landing 150, docs 150, limpiezas −20)
- Decision needed before apply: **Yes**
- Chained PRs recommended: **Yes** (1: Sentry · 2: brand+landing · 3: limpiezas+docs)
- 400-line budget risk: **Medium-High**
