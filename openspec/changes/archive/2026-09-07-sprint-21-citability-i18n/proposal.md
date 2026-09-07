# Proposal: Sprint 21 — Citability i18n (ES)

## Intent

Landing de Relevy (ES) puntúa 49.9 en citabilidad; causa raíz verificada con `scorePage`: el engine solo reconoce patrones en INGLÉS → los 25 bloques quedan en `ans:20` (Answer Block Quality = 30% del peso). Todo sitio en español queda sub-calificado. Fix del ENGINE (patterns i18n EN+ES), sin tocar contenido ni pesos.

## Scope

### In Scope
1. **i18n de constants** (`src/citability/constants.ts`): `DEFINITION_PATTERN` (+ES "es un/una", "son unos/unas"), `ANSWER_COPULA` (+es/son/era/eran/fue/fueron), `FIRST_PERSON_LEAD` (+nuestro/nuestra/nosotros/nosotras), `UNIQUENESS_PHRASES` (+9 frases ES), `PRONOUN_LEAD` (+esto/eso/aquello/este/esta/estos/estas), `CONJUNCTION_LEAD` (+pero/sin embargo/y/además/así que/aunque).
2. **Tests strict TDD**: regresión EN (fixtures intactos) + casos ES por patrón; fixture landing ES → bloques con definición `ans ≥ 60`; nuevo page score (~75-85).
3. **Verificación**: `pnpm test` + lint + typecheck; `scorePage` real contra relevy.app post-deploy.

### Out of Scope
- Pesos; contenido landing; otros engines; NFD; plantillas ES de rewrite (RCI-12).

## Capabilities

> Contrato con sdd-spec (investigado: `openspec/specs/citability-engine/spec.md`, ids RCI-1..14).

### New Capabilities
- None.

### Modified Capabilities
- `citability-engine`: reconocimiento de patrones bilingüe EN+ES — ADDED REQ-21.x (Given/When/Then, EN) + MODIFIED RCI-3 (definition/copula), RCI-4 (pronoun/conjunction leads), RCI-7 (first-person/uniqueness) para exigir soporte ES sin regresión EN.

## Approach

- Matcher combinado EN+ES in-place bajo nombres exportados actuales. Verificado: solo `scorer.ts` consume estos patterns → sin breaking exports, 0-10 líneas de cambio ahí.
- `UNIQUENESS_PHRASES` se extiende en el mismo array. Fixtures ES + describe blocks; regresión EN por fixtures existentes.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/citability/constants.ts` | Modified | patterns combinados EN+ES |
| `src/citability/scorer.ts` | Modified (0-10) | imports solo si hay renames |
| `src/citability/__tests__/scorer.test.ts` | Modified | describe i18n (ES + regresión EN) |
| `src/citability/__fixtures__/*-es.html` | New | bloques/landing en ES |
| `openspec/changes/sprint-21-citability-i18n/specs/citability-engine/spec.md` | New | delta REQ-21.x |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Falsos positivos ES ("es una buena práctica") | Med | bonus acotado (+40); escenarios de validación |
| Pins stale al subir score ES (scorehero, evidencia landing) | Med | re-pin honesto post-deploy en verify |
| Regresión EN | Low | fixtures EN = red automática |
| Acentos + `\b` | Low | términos locked no terminan en acento |

## Rollback Plan

`git revert` de los commits del engine: `constants.ts` + tests vuelven a EN-only. Sin migraciones ni datos; riesgo aislado al scorer de citabilidad.

## Dependencies

- Ninguna externa. Diagnóstico relevy.app requiere red + deploy (verify, manual).

## Success Criteria

- [ ] Bloques ES con definición ("Relevy es una plataforma de auditoría GEO/SEO…") → `ans ≥ 60`
- [ ] Page score fixture landing ES sube; relevy.app ~75-85 documentado
- [ ] `pnpm test` + lint + typecheck verdes; regresión EN sin cambios
- [ ] Sin cambios de weights ni contenido landing

## Review Workload Forecast

- Líneas estimadas: ~150-250 (constants ~40, tests ~120, fixtures ~70)
- Decision needed before apply: **No**
- Chained PRs recommended: **No** (single PR)
- 400-line budget risk: **Low**
