# Exploration: Sprint 20 — Close Free

- **Change**: `sprint-20-close-free` · **Phase**: explore · **Date**: 2026-09-06 · **Mode**: hybrid (openspec + engram)
- **Branch**: `feat/sprint-20-close-free` (base `296c719` = develop/main, sprint 19 mergeado)

## Current State

Sprint 20 = cierre del plan FREE sin monetización. `docs/SPRINT-ROADMAP.md:66` define solo intención: Sentry · brand presence final · announce/marketing · dominio final · remote → relevy.git (cosmético) · limpieza W-1..W-3 · merge de feat/sprint-19-schema-up (YA mergeado en 296c719 #84 — roadmap stale). Sin requisitos definidos.

Hallazgo transversal: README.md más stale que W-3 — describe features inexistentes (PDF vivo :19, pesos v2.0.0 :11, Resend :28 sin ser dep, y reclama Sentry en deploy :31 sin estar instalado).

## 1. Roadmap

- `docs/SPRINT-ROADMAP.md:66` solo intención. Stale: :19/:58 "sprint-19 sin mergear" (mergeado), :26 Main/Develop eeeaf3f (ahora 296c719). Actualizar roadmap = tarea Close Free.

## 2. Sentry — NO INSTALADO

- package.json sin @sentry/nextjs; sin sentry.*.config.ts ni instrumentation.ts (glob 0); .env.example sin SENTRY_DSN; next.config.ts sin withSentryConfig. Error tracking hoy = solo logs de Vercel.
- Activar: @sentry/nextjs runtime + sentry.client/server.config.ts + instrumentation.ts (register + onRequestError) + withSentryConfig + SENTRY_DSN con guard no-op. Manual setup documentado "para Next.js 15+ con Turbopack y App Router" — no bloqueante. turbopackApplicationKey es para Next 16+. CSP report-only connect-src 'self' → al enforcear, permitir *.ingest.sentry.io.

## 3. Brand presence

- EXISTE: src/lib/brand.ts (single source, sameAs 5 reales, sin inventos), logo.tsx + icon.svg (mark comillas navy/emerald), metadata layout, OG/Twitter vía src/lib/og.ts → public/og.png, JSON-LD Org+Article (schema 93), llms.txt + sitemap/robots, canales reales (GitHub, LinkedIn, ezefernandez.com, TikTok @ezefernandezdev, repo relevy).
- FALTA: public/og.png del 2026-08-25 pre-rebrand (casi seguro no es el mark — verificar visualmente, regenerar opcional brief §6); public/*.svg starter sin consumidor (next/vercel/window/globe/file); sin canal de anuncio (sin blog, sin perfil de producto); docs vivos con "GeoAudit" (openspec/config.yaml:4, pnpm-workspace.yaml:1, ci.yml:1, SPRINT-ROADMAP:1, performance.md:49); docs/RELEVY-BRAND-BRIEF.md UNTRACKED (decidir commit).
- "Anuncio" requiere decisión del usuario: (a) sección launch landing + og.png de marca, (b) post externo (LinkedIn/TikTok), (c) ambos.

## 4. Limpiezas verificadas

- W-1 CONFIRMADO Y AGRAVADO: lighthouse@13.4.1 devDep (package.json:56) + lock retiene puppeteer-core@25.8.0 (lock:3139/6907); scripts/lighthouse.mjs:31 importa `puppeteer` que NO resuelve (ERR_MODULE_NOT_FOUND verificado) → `pnpm run lighthouse` ROTO desde sprint 18. Opciones: (a) remover lighthouse (alineado sprint 18, resuelve W-1), (b) re-agregar puppeteer devDep, (c) puppeteer-core devDep + chrome autodetectado. Decisión para proposal.
- W-2 CONFIRMADO: node_modules/.pnpm/@sparticuz+chromium-min@149.0.0 existe; también orphans puppeteer@25.1.0/25.8.0. pnpm install fresco poda (no corrí install).
- W-3 CONFIRMADO Y AMPLIADO: openspec/config.yaml:6 + README.md:28 + AGENTS.md:12 (misma línea stale) + pnpm-workspace.yaml:10 (allowBuild puppeteer) + docs/performance.md:94 + lighthouse.mjs (import real roto). NO tocar: a11y-contrast.test.ts:63 (fallback intencional) y briefs históricos.
- public/fonts/ CONFIRMADO huérfano: 5 TTFs, 0 refs en src/ (fuentes vía next/font/google layout.tsx:2). Remanente era PDF.

## 5. Deuda técnica

- scoringModelVersion degradado → RESUELTA (audit/index.ts:226-228 escribe 3.1.0, RAO-16)
- eslint coverage/ → RESUELTA (eslint.config.mjs:23)
- RGS-1 delta → RESUELTA (score-hero-evidence.ts: relevy 62/moz 57/avg 42.4; test T9 pesos v3.1)
- remote relevy.git → PENDIENTE (origin = geoaudit.git confirmado, cosmético)

## Recommendation

4 work units: (1) Sentry MVP, (2) limpieza W-1..W-3 + fonts + SVGs + remote + marca docs vivos (recomiendo REMOVER lighthouse, decisión usuario), (3) sync README/AGENTS/roadmap, (4) brand/announce (requiere definición del usuario antes de proposal).

## Risks

- Lighthouse roto silencioso; Sentry pin de versión + source maps omitidos en MVP; scope creep "announce"; README claims falsos = superficie de marca; W-2 install aparte; presupuesto 400 líneas por limpieza docs (chained PRs).

## Ready for Proposal

Sí para 1-3. No para "announce" hasta definir significado + decisión lighthouse (remover vs reparar).
