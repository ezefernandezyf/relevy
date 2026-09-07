# Docs & Brand Specification

> **Change**: `sprint-20-close-free` · **Type**: New capability (ADDED)

## Purpose

Live documentation and brand-marker consistency. This capability keeps the live docs (README, AGENTS, config, workspace, CI, performance, roadmap) in sync with the Relevy reality — no stale "GeoAudit" claims, no fabricated stack features — and commits the Relevy brand brief.

## Requirements

| # | Requirement | Status | Strength | Summary |
|---|-------------|--------|----------|---------|
| REQ-20.4 | Live docs sync | ADDED | MUST | grep "GeoAudit" = 0 in live docs; README claims match reality; stack config synced; roadmap reflects the sprint 19 merge |
| REQ-20.5 | Brand brief committed | ADDED | MUST | `docs/RELEVY-BRAND-BRIEF.md` is tracked and consistent with `brand.ts` |

### Requirement: Live Docs Sync (REQ-20.4)

When the live documentation is inspected, then it MUST reflect the Relevy reality and not stale "GeoAudit" claims: `grep "GeoAudit"` returns 0 in the live docs (`README.md`, `AGENTS.md`, `openspec/config.yaml`, `pnpm-workspace.yaml`, `.github/workflows/ci.yml`, `docs/performance.md`, `docs/SPRINT-ROADMAP.md`). `README.md` MUST NOT claim PDF export, Resend, or Puppeteer, MUST list Sentry as installed monitoring, MUST use the v3.1.0 weights table (24/23/15/12/14/12, no "Peso (v2.0.0)" header), and MUST state an honest FREE plan (10 audits / 30 days, no PDF/multi-page). `AGENTS.md` MUST NOT carry a "PDF: Puppeteer" line. `openspec/config.yaml` MUST name Relevy with the real stack. `pnpm-workspace.yaml` MUST NOT allow-build puppeteer. `ci.yml` carries a Relevy comment (the lowercase `geoaudit` in `DATABASE_URL` is infra and stays). `docs/performance.md` MUST NOT contain "GeoAudit" and carries the Lighthouse removal note. The roadmap MUST reflect the sprint 19 merge (`296c719`, PR #84) and updated Main/Develop. Historical briefs and archives are excluded (Sprint 11 decision).

#### Scenario: No GeoAudit in live docs

- GIVEN the live docs set (`README.md`, `AGENTS.md`, `openspec/config.yaml`, `pnpm-workspace.yaml`, `.github/workflows/ci.yml`, `docs/performance.md`, `docs/SPRINT-ROADMAP.md`)
- WHEN a `grep "GeoAudit"` is run
- THEN it returns 0 matches (excluding historical briefs and archives)

#### Scenario: Stack claims match reality

- GIVEN `README.md`, `AGENTS.md`, `openspec/config.yaml`, and `pnpm-workspace.yaml`
- WHEN their stack claims are inspected
- THEN README does not claim PDF export, Resend, or Puppeteer; Sentry is listed as monitoring; the weights table uses v3.1.0 (24/23/15/12/14/12, no "Peso (v2.0.0)" header); the FREE plan is honest (10 audits / 30 days, no PDF/multi-page); AGENTS has no "PDF: Puppeteer" line; config names Relevy with the real stack; workspace does not allow-build puppeteer

#### Scenario: SDD config and workspace synced

- GIVEN `openspec/config.yaml` and `pnpm-workspace.yaml`
- WHEN they are inspected
- THEN they name Relevy and the real stack, with the `ci.yml` comment updated to Relevy (the lowercase `geoaudit` in `DATABASE_URL` stays as infra)

#### Scenario: Roadmap reflects the sprint 19 merge

- GIVEN `docs/SPRINT-ROADMAP.md`
- WHEN it is inspected
- THEN it reflects the sprint 19 merge (`296c719`, PR #84) and updated Main/Develop

### Requirement: Brand Brief Committed (REQ-20.5)

When the brand marker is inspected, then `docs/RELEVY-BRAND-BRIEF.md` (previously untracked) MUST be committed to the repository, and it MUST be consistent with `src/lib/brand.ts` (Relevy, `relevy.app`, "AI Visibility & GEO Audit").

#### Scenario: Brief is tracked

- GIVEN `docs/RELEVY-BRAND-BRIEF.md`
- WHEN its git status is inspected
- THEN it is tracked by git (committed)

#### Scenario: Brief consistent with brand constants

- GIVEN `docs/RELEVY-BRAND-BRIEF.md`
- WHEN its content is compared with `src/lib/brand.ts`
- THEN it is consistent (Relevy, `relevy.app`, "AI Visibility & GEO Audit")

## Compliance Matrix

| Requirement | Scenarios | Coverage |
|-------------|-----------|----------|
| REQ-20.4 | No GeoAudit in live docs, Stack claims match reality, SDD config and workspace synced, Roadmap reflects the sprint 19 merge | Covered |
| REQ-20.5 | Brief is tracked, Brief consistent with brand constants | Covered |
