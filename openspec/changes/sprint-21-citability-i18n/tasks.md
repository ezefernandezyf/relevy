# Tasks: Sprint 21 — Citability i18n (ES)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150-250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: feature-branch-chain
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Answer ES (REQ-21.1/21.2) | PR 1 (único) | `pnpm test -- src/citability/__tests__/scorer.test.ts` | N/A — unit puro; fixture ES real recién en WU-4 | revert constants.ts + tests WU-1 |
| 2 | Bad leads ES (REQ-21.4) | PR 1 | `pnpm test -- src/citability/__tests__/scorer.test.ts` | N/A — idem WU-1 | revert constants.ts + tests WU-2 |
| 3 | Uniqueness ES (REQ-21.3) | PR 1 | `pnpm test -- src/citability/__tests__/scorer.test.ts` | N/A — idem WU-1 | revert constants.ts + tests WU-3 |
| 4 | Fixture ES + gates | PR 1 | `pnpm test` | scorePage sobre `page-es-landing.html`; `verify:scorehero` re-pin post-deploy (verify) | revert fixture + index.test.ts |

## Phase 1: WU-1 — Answer patterns ES

- [ ] 1.1 RED: describe "Spanish answer patterns (REQ-21.1/21.2)" en `scorer.test.ts`: `blockWith()` con "Relevy es una plataforma de auditoría GEO/SEO…" y "son unas" → answer ≥ 60; copula "es"/"fue" en primera frase → ≥ 60 → FAIL
- [ ] 1.2 GREEN: en `constants.ts`, extender `DEFINITION_PATTERN` (es un/una · son unos/unas) y `ANSWER_COPULA` (es son era eran fue fueron) → focused test PASS
- [ ] Commit: `feat(citability): add spanish support to answer patterns`

## Phase 2: WU-2 — Bad leads ES

- [ ] 2.1 RED: describe "Spanish bad leads (REQ-21.4)": `blockWith()` con "Esto significa que…" y "Sin embargo, …" → selfContainment < 30 → FAIL
- [ ] 2.2 GREEN: extender `PRONOUN_LEAD` (esto eso aquello este esta estos estas) y `CONJUNCTION_LEAD` (pero sin embargo y además así que aunque) → PASS
- [ ] Commit: `feat(citability): detect spanish pronoun and conjunction leads`

## Phase 3: WU-3 — Uniqueness ES

- [ ] 3.1 RED: describe "Spanish uniqueness (REQ-21.3)": `blockWith()` con "Nosotros encuestamos a 120 especialistas…" → ≥ 70; "…según nuestra investigación…" en cuerpo → ≥ 70 → FAIL
- [ ] 3.2 GREEN: extender `FIRST_PERSON_LEAD` (nuestro nuestra nosotros nosotras) y `UNIQUENESS_PHRASES` (8 frases ES) → PASS
- [ ] Commit: `feat(citability): recognize spanish uniqueness signals`

## Phase 4: WU-4 — Fixture ES y gates

- [ ] 4.1 Crear `src/citability/__fixtures__/page-es-landing.html`: 2-3 bloques H2 en ES; primer bloque con lead "Relevy es una plataforma de auditoría GEO/SEO que…"
- [ ] 4.2 En `index.test.ts`: `scorePage` sobre el fixture ES → primer bloque answer ≥ 60; documentar pageScore resultante en comentario
- [ ] 4.3 Gates: `pnpm test` (suite completa, regresión EN intacta REQ-21.5) + `pnpm run lint` + `pnpm run typecheck` verdes
- [ ] 4.4 Doc: nota — `verify:scorehero`/`score-hero-evidence.ts` stale al subir score ES; re-pin post-deploy (verify, fuera de scope)
- [ ] Commit: `test(citability): add spanish landing fixture coverage`
