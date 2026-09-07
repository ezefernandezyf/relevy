# Performance Specification — Delta

> **Change**: `sprint-20-close-free` · **Type**: Delta (MODIFIED + ADDED)

## MODIFIED Requirements

### Requirement: Lighthouse Tooling (PERF-1)

When performance is measured, then the Lighthouse tooling MUST be removed from the repository — the `lighthouse` devDependency, the npm `lighthouse` script, and `scripts/lighthouse.mjs` (broken since Sprint 18: `import puppeteer` → `ERR_MODULE_NOT_FOUND`) — and the `pnpm install` prune MUST remove the transitive `puppeteer-core` from the lockfile. Historical performance evidence in `docs/performance.md` (scan 2026-08-25) MUST be preserved with a note of the removal. PERF-2 and PERF-3 remain unchanged.

(Previously: PERF-1 required Lighthouse tooling to be available via an npm script or documented manual command. It is now removed per the user decision — not repaired.)

#### Scenario: No lighthouse tooling present

- GIVEN `package.json` and `scripts/`
- WHEN they are inspected
- THEN there is no `lighthouse` devDependency, no npm `lighthouse` script, and no `scripts/lighthouse.mjs`

#### Scenario: Transitive puppeteer-core pruned

- GIVEN `pnpm-lock.yaml`
- WHEN it is inspected
- THEN it contains no `puppeteer-core` entry (pruned by `pnpm install`)

#### Scenario: Historical evidence preserved

- GIVEN `docs/performance.md`
- WHEN it is inspected
- THEN the 2026-08-25 performance evidence is preserved
- AND a note documents the Lighthouse tooling removal

## ADDED Requirements

### Requirement: Remove Orphan Fonts (REQ-20.3)

When the app serves its fonts, then the orphan `public/fonts/` directory MUST be removed (5 TTFs with zero references; fonts are loaded via `next/font/google` in `layout.tsx`). There MUST be zero references to the removed TTFs in the codebase.

#### Scenario: No files under public/fonts/

- GIVEN `public/fonts/`
- WHEN it is inspected
- THEN the directory does not exist (or contains no files)

#### Scenario: Zero references to the removed TTFs

- GIVEN the repository source
- WHEN references to the removed TTF files are searched
- THEN there are zero references

## Compliance Matrix

| Requirement | Scenarios | Coverage |
|-------------|-----------|----------|
| PERF-1 | No lighthouse tooling present, Transitive puppeteer-core pruned, Historical evidence preserved | Covered |
| REQ-20.3 | No files under public/fonts/, Zero references to the removed TTFs | Covered |
