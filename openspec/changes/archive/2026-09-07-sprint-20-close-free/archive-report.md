# Archive Report: Sprint 20 — Close Free

- **Change**: `2026-09-07-sprint-20-close-free`
- **Archived**: 2026-09-07
- **Project**: Relevy (repo local `geo-saas`, GitHub `relevy`)
- **Mode**: hybrid (OpenSpec + Engram)
- **Branch**: `feat/sprint-20-close-free` (branch tracker; develop = `b0b7cf2` = PRs #85/#86/#87)

## Status at Close

- **Verdict**: PASS
- **Completeness**: 9/9 requirements, 28/28 scenarios compliant.
- **Tasks**: 7/7 checkboxes `[x]` in the persisted tasks artifact (T1-T7). Zero unchecked tasks at close; archive-time stale-checkbox reconciliation performed (see below).
- **Tests**: `pnpm test` → 1106 passed / 0 failed / 4 skipped (118 files passed | 1 skipped); `pnpm run lint` → exit 0; `pnpm run typecheck` → exit 0 (build gate per repo convention — never build after changes).
- **Review gate**: no receipt-driven review artifacts exist for this candidate (no `reviewGate` in structured status; no review artifacts anywhere in the repo) — archived under ordinary repository policy.
- **Milestone**: MERGEADO. Cadena feature-branch-chain de 3 PRs mergeada a develop = `b0b7cf2`: PR #85 (Sentry, `859101b`) → PR #86 (Brand+landing, `00db571` + `0293347`) → PR #87 (Cleanup+docs, `0c416eb` + `607dcc3` + `9b8d0c8`), sin squash mid-chain (D8).

## Alcance entregado (racional)

Sprint 20 cierra el plan FREE (salida oficial sin Stripe): monitoreo real, marca final, anuncio honesto en la landing, limpiezas W-1..W-3 y sync de docs a la realidad.

1. **Sentry MVP (REQ-20.1, error-monitoring NUEVO)**: `@sentry/nextjs@10.73.0` pin exacto en deps; setup manual (3 configs runtime `sentry.{client,server,edge}.config.ts` + `instrumentation.ts` con `register` + `onRequestError` — middleware.ts es Edge); `withSentryConfig` desde `@sentry/nextjs/config` (v10 movió el export; main-entry deprecated) preservando `headers()`; guard no-op `Sentry.init({ dsn, enabled: !!dsn })` — sin DSN no inicializa ni tira error (cubierto por 21 tests de `sentry-config.test.ts`); source maps omitidos (MVP, sin `SENTRY_AUTH_TOKEN`); `.env.example` documenta `SENTRY_DSN` opcional.
2. **CSP (REQ-20.2)**: `connect-src` += `https://*.ingest.sentry.io` manteniendo `'self'`; header sigue `Content-Security-Policy-Report-Only`; resto de directivas intactas.
3. **og.png de marca (LND-8 MODIFIED, landing-page)**: regenerado manualmente por el usuario (SVG→PNG 1200×630, mark de `src/app/icon.svg`); sha256 `aca844d2…` ≠ pre-rebrand `9e854ba0…`; `OG_IMAGE` sigue en `/og.png`; verificación visual humana documentada y confirmada por el usuario.
4. **Launch section (LND-20.1 ADDED)**: sección honesta entre FAQ (6) y CTA (7); copy en `src/lib/copy.ts` (`LANDING_COPY.launch`, 112 palabras, ES neutro pasando `VOSEO_PATTERN`, "10 auditorías"/"30 días", sin claims inventados — sin tiers pagos, sin features no shipheadas); design system navy/emerald/amber + Instrument Serif/Work Sans.
5. **SVGs starter (LND-20.2 ADDED)**: `public/{next,vercel,window,globe,file}.svg` removidos; 0 refs en `src/` y `app/` (scan self-guarded con control positivo).
6. **Lighthouse removido (PERF-1 MODIFIED, performance)**: `lighthouse` devDep + script npm + `scripts/lighthouse.mjs` (roto desde sprint 18 — `ERR_MODULE_NOT_FOUND`) eliminados; poda W-2 vía `pnpm install`: lockfile −751 líneas / 0 añadidas, `puppeteer-core` = 0; evidencia histórica 2026-08-25 preservada en `docs/performance.md` con nota de remoción. PERF-2/PERF-3 intactos.
7. **Fonts huérfanos (REQ-20.3 ADDED)**: `public/fonts/` (5 TTFs, 0 refs; fuentes vía `next/font/google`) removido.
8. **Docs vivos sync (REQ-20.4, docs NUEVO)**: grep "GeoAudit" = 0 en 7 docs vivos (README, AGENTS, config.yaml, pnpm-workspace, ci.yml, performance.md, SPRINT-ROADMAP); README sin claims PDF/Resend/Puppeteer + Sentry listado + pesos v3.1.0 (24/23/15/12/14/12, sin header v2.0.0) + Free honesto 10/30d; AGENTS sin "PDF: Puppeteer"; config Relevy + stack real; workspace sin `allowBuild puppeteer`; ci.yml comentario Relevy (`geoaudit` lowercase en DATABASE_URL = infra, intacto); roadmap `296c719` (#84). Briefs históricos y archives excluidos (decisión sprint 11).
9. **Brand brief (REQ-20.5)**: `docs/RELEVY-BRAND-BRIEF.md` commiteado (antes untracked), consistente con `src/lib/brand.ts` (Relevy, `relevy.app`, "AI Visibility & GEO Audit").

Cero cambios de scoring, cero monetización, cero cambios fuera del scope del proposal.

## Delivery Notes

- Cadena feature-branch-chain (tracker `feat/sprint-20-close-free`, base `296c719` = develop):
  - **PR #85 Sentry** — `859101b` `feat(monitoring): add Sentry error tracking` (T1+T2, 8 esc.).
  - **PR #86 Brand+landing** — `00db571` `feat(landing): add launch section` + `0293347` `chore(brand): regenerate og image with Relevy mark` (T3 + T4).
  - **PR #87 Cleanup+docs** — `0c416eb` `chore(deps): remove lighthouse and prune lockfile` + `607dcc3` `chore(docs): sync brand and claims` + `9b8d0c8` `docs(brand): add Relevy brand brief` (T5 + T6 + T7), sin squash mid-chain.
- **Merge**: completado a develop = `b0b7cf2` (PRs #85/#86/#87 mergeados). develop = `b0b7cf2`.
- El verify corrió en el worktree `/home/ezeyf/Escritorio/geo-saas-worktrees/pr3-cleanup-docs` (branch `feat/sprint-20-close-free-pr3-cleanup-docs`, tip `9b8d0c8` + verify `15144d2`); el verify-report físico fue commiteado al tracker `feat/sprint-20-close-free` (`15144d2` y `b0b7cf2`).
- Commit de archive: `chore(sdd): archive sprint-20-close-free` (conventional — título EN, descripción ES). Sin push, sin PR.

## Archive-time Reconciliation

**Divergencia de estado (registrada, no resuelta en silencio)**: el launch prompt del orquestador afirmaba que los artifacts SDD viven físicamente en la branch tracker `feat/sprint-20-close-free` (proposal, specs, design, tasks como archivos, con `tasks.md` con cambios locales sin commitear). El estado REAL del repo al momento del archive: la carpeta `openspec/changes/sprint-20-close-free/` contenía SOLO `verify-report.md` (commiteado en `15144d2`/`b0b7cf2`). Los artifacts `proposal.md`, `exploration.md`, `design.md`, `tasks.md` y los 4 delta specs NUNCA existieron como archivos en git (verificado con `git log --all --name-only` y `git ls-tree` en todas las refs: solo `verify-report.md` aparece). La fuente de verdad de esos artifacts era **Engram** (`sdd/sprint-20-close-free/{explore,proposal,spec,design,tasks,apply-progress}` = obs #1914-1919). El working tree de la branch tracker NO tenía `tasks.md` con cambios locales — solo `.atl/*` modificados (preexistentes, no commiteados).

**Acción**: al ser modo hybrid y requerir el archive un audit trail completo en filesystem, se RECONSTRUYERON los artifacts faltantes en `openspec/changes/sprint-20-close-free/` a partir de las observaciones de Engram (fuente de verdad), antes del move mecánico. Los archivos reconstruidos son: `exploration.md` (obs #1914), `proposal.md` (#1915), `specs/{error-monitoring,landing-page,performance,docs}/spec.md` (#1916), `design.md` (#1917), `tasks.md` (#1918). El snapshot + `diff -r` del move mecánico cubrió la carpeta completa (9 archivos, byte-identical, diff vacío). Esta reconstrucción es creación legítima desde la fuente de verdad, no re-escritura de bytes existentes.

**Reconciliación de checkboxes (aprobada por el orquestador)**: el `tasks.md` físico del tracker conservaba T4-T7 sin `[x]` por instrucción del orquestador (la marcación se difirió a archive — SUGGESTION 1 del verify). Al archive se marcaron T1-T7 `[x]` en el `tasks.md` reconstruido, con evidencia de completitud: Engram `apply-progress` #1919 (3 slices FINAL, TDD Cycle Evidence) + verify-report PASS (Completeness 7/7) + la suite 1106 passed. El Task Completion Gate se validó contra el artefacto persistido (Engram tasks #1918, que ya tenía T1-T7 `[x]`). La reconciliación se registra en el propio `tasks.md` (nota de reconciliación).

## Verification Findings (carried to close, non-blocking)

Registradas como FOLLOW-UPS / notas, no como blockers (forward de hechos finales del orquestador, 2026-09-07):

- **SUGGESTION 1 (tasks.md del tracker)**: el `tasks.md` físico del tracker conservaba T4-T7 sin `[x]` → RESUELTO en archive (marcados, ver Archive-time Reconciliation).
- **SUGGESTION 2 (smoke E2E real del launch)**: `pnpm dev` devuelve HTTP 500 en `/` solo por `DATABASE_URL is not set` (no hay `.env` en el worktree) — ambiental y pre-existente, sin relación con el change. Un smoke E2E real del launch section requiere un `.env` con la cadena de Supabase → follow-up del milestone/deploy.
- **SUGGESTION 3 (nomenclatura T7)**: apply-progress rotula T7 = "brief (REQ-20.5)" mientras `tasks.md` rotula T7 = "Gate"; la Gate (test/lint/typecheck/format) quedó validada como "Verification Results" del slice 3. Sin impacto funcional; cosmético.
- **Poda W-2 verificada**: lockfile sin `puppeteer-core`/`lighthouse` (−751 líneas, 0 añadidas); `grep puppeteer pnpm-lock.yaml` = 0. Nota: `pnpm install` no pruna los dirs físicos huérfanos del virtual store `.pnpm/` (comportamiento pnpm 11); se removieron a mano.
- **og.png**: hash `aca844d2…` ≠ `9e854ba0…`, 1200×630, verificación visual humana confirmada por el usuario.

## Final-State Facts (from orchestrator, outrank intermediate snapshots)

- Verify: PASS (9/9 req, 28/28 escenarios, 1106 tests, lint/typecheck clean).
- Cadena mergeada: PR #85 → #86 → #87 → develop `b0b7cf2`.
- SUGGESTIONs del verify (no blockers): (1) tasks.md físico del tracker conserva T4-T7 sin `[x]` → archive debe marcarlos y commitear (HECHO); (2) smoke E2E real del launch requiere `.env` Supabase; (3) nomenclatura T7.
- Poda W-2 verificada: lockfile sin puppeteer-core/lighthouse (−751 líneas, 0 añadidas).
- og.png: hash `aca844d2` ≠ `9e854ba0`, 1200×630, verificación visual humana confirmada por el usuario.
- Pendientes post-archive (follow-ups): setear `SENTRY_DSN` en Vercel env; merge milestone develop→main; anuncio externo (posts del usuario).

## Spec Sync (delta → canonical)

| Domain | Action | Details |
|--------|--------|---------|
| error-monitoring | Creado (spec nueva) | REQ-20.1 ADDED (Sentry SDK setup, 6 escenarios) + REQ-20.2 ADDED (CSP connect-src, 2 escenarios). `openspec/specs/error-monitoring/spec.md` creado byte-idéntico (diff -r vacío). |
| landing-page | Actualizado (merge de delta) | LND-8 MODIFIED (og.png regenerado, +2 escenarios: og.png es el mark Relevy + OG helper sigue en /og.png) + LND-20.1 ADDED (launch section, 4 escenarios) + LND-20.2 ADDED (starter SVGs removidos, 2 escenarios). Tabla de requisitos + bloques + Compliance Matrix actualizadas; header y purpose actualizados. |
| performance | Actualizado (merge de delta) | PERF-1 MODIFIED (invertido: tooling Lighthouse removido, +2 escenarios: sin tooling + puppeteer-core pruned) + REQ-20.3 ADDED (fonts huérfanos, 2 escenarios). Tabla de requisitos + bloques + Compliance Matrix actualizadas; header actualizado. |
| docs | Creado (spec nueva) | REQ-20.4 ADDED (live docs sync, 4 escenarios) + REQ-20.5 ADDED (brand brief, 2 escenarios). `openspec/specs/docs/spec.md` creado byte-idéntico (diff -r vacío). |

`docs/SPRINT-ROADMAP.md` actualizado: Sprint 20 (Close Free) marcado archivado (1106 tests, PASS 9/9 · 28/28, develop = `b0b7cf2` = PRs #85/#86/#87); Main/Develop `296c719`/`b0b7cf2`; siguientes: merge milestone develop→main (release/sprint-20) + deploy + `SENTRY_DSN` en Vercel; post-sprint: anuncio externo (posts del usuario); W-1..W-3 del Sprint 18 marcados RESUELTOS; nota del remote local `geoaudit.git` actualizada (pendiente cosmético post-Sprint 20).

## Mechanical Copy Evidence

Archival move performed with native shell. Snapshot recursivo pre-move comparado contra el folder archivado:

```text
$ diff -r <snapshot>/source openspec/changes/archive/2026-09-07-sprint-20-close-free
(no output — byte-identical, exit 0)
```

9 archivos en el snapshot (verify-report.md + 8 reconstruidos), todos byte-idénticos tras `git mv`. Los copys de specs nuevas (error-monitoring, docs) también verificados con `diff -r` (vacíos, exit 0). `archive-report.md` es additive-only (no existía en el snapshot fuente) y queda excluido de la comparación. Diff status 0 es la única evidencia de paso.

## Engram Traceability

Hybrid persistence. Observaciones de Engram LEÍDAS para esta fase (proyecto `geoaudit`):
- #1914 `sdd/sprint-20-close-free/explore` — reconstrucción de `exploration.md`
- #1915 `sdd/sprint-20-close-free/proposal` — reconstrucción de `proposal.md`
- #1916 `sdd/sprint-20-close-free/spec` — reconstrucción de los 4 delta specs
- #1917 `sdd/sprint-20-close-free/design` — reconstrucción de `design.md`
- #1918 `sdd/sprint-20-close-free/tasks` — reconstrucción de `tasks.md` + gate de completitud de tareas
- #1919 `sdd/sprint-20-close-free/apply-progress` — evidencia de completitud T1-T7 (3 slices FINAL)
- #1921 `sdd/sprint-20-close-free/verify-report` — cross-check del verify-report físico (idéntico en contenido y frontmatter)

Archive report persistido en Engram como `sdd/sprint-20-close-free/archive-report` (proyecto `geoaudit`, tipo architecture, capture_prompt false).

## Roadmap

`docs/SPRINT-ROADMAP.md` actualizado: Sprint 20 (Close Free) archivado (1106 tests, PASS 9/9 · 28/28, develop = `b0b7cf2` = PRs #85/#86/#87, cadena feature-branch-chain); siguiente: merge milestone `develop` → `main` (release/sprint-20) + deploy Vercel + `SENTRY_DSN`; post-sprint: anuncio externo (posts del usuario).