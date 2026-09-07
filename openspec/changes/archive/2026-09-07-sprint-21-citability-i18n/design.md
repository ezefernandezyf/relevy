# Design: Sprint 21 — Citability i18n (ES)

## Technical Approach

Extend six pattern constants in `src/citability/constants.ts` with Spanish alternatives under the SAME exported names. Verified: only `scorer.ts` consumes these patterns — no import churn, and English branches stay intact inside each regex/array, so English scoring is untouched (REQ-21.5). `scorer.ts`, `text.ts`, `rewrite.ts`, `index.ts` require zero changes.

## Architecture Decisions

### Decision: In-place bilingual patterns under existing export names

| Option | Tradeoff | Decision |
|---|---|---|
| Extend constants in place, names unchanged | No import changes; EN regression trivial (branches preserved) | **Adopted** |
| New `*_ES` constants or lang maps | Duplicated matcher paths; scorer import churn; more diff for no behavior gain | Rejected |

### Decision: Combined regex shapes (REQ-21.x tokens)

```ts
// es/ son plural only, per REQ-21.1 (proposal's `un[oa]s?` shorthand expanded)
DEFINITION_PATTERN = /\b(?:is\s+(?:a|an)|es\s+(?:un|una)|son\s+(?:unos|unas))\s+/i;
ANSWER_COPULA      = /\b(?:is|are|was|were|es|son|era|eran|fue|fueron)\b/i;
FIRST_PERSON_LEAD  = /^(?:we|our|i|nuestro|nuestra|nosotros|nosotras)\b/i;
PRONOUN_LEAD       = /^(?:it|this|that|these|those|esto|eso|aquello|este|esta|estos|estas)\b/i;
CONJUNCTION_LEAD   = /^(?:but|however|and|also|so|yet|pero|sin\s+embargo|y\s+además|así\s+que|aunque)\b/i;
UNIQUENESS_PHRASES = [...EN, "encuestamos", "analizamos", "nuestro análisis",
  "nuestros datos", "nuestra investigación", "nuestros hallazgos",
  "encontramos", "en nuestra experiencia"]; // lowercase: scorer matches on lowercased lead
```

Boundary note: every locked token starts/ends with a plain ASCII letter; accented tokens (`así`, `además`) sit mid-branch before `\s+`, so ASCII `\b` semantics are safe (proposal risk "acentos + \b" = Low, confirmed).

### Decision: REQ-21.x prompt scope is normative over proposal approach lines

| Discrepancy | Resolution |
|---|---|
| Proposal lists bare "y"/"además"; REQ-21.4 lists "y además" | `y\s+además` as one branch — bare "y" leads not penalized (avoids penalizing any sentence starting "Y…") |
| Proposal says "+9 frases ES"; REQ-21.3 enumerates 8 | The enumerated 8 are normative; no invented 9th |
| REQ-21.3 omits "nosotras" | Include it (proposal superset, symmetric with nosotros, harmless) |

### Decision: ES false positives accepted (bounded, mirrors EN heuristics)

| Case | Bound |
|---|---|
| "es una buena práctica" matches the definition branch | Bonus +40 only; heuristic posture identical to EN |
| "era"/"fue" as noun/auxiliary ("la era digital") | First-sentence bonus applies only to a COMPLETE first sentence ≤ 60 words; copula check is first-sentence-only |

## Data Flow

No pipeline change — pattern constants feed the three dimension scorers exactly as today:

    constants.ts ──→ scoreAnswer / scoreSelfContainment / scoreUniqueness ──→ scoreBlock ──→ scorePage
                    (wider vocabulary; weights, formulas and flow untouched)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/citability/constants.ts` | Modify | Six pattern constants extended EN+ES + docblock note |
| `src/citability/__tests__/scorer.test.ts` | Modify | New i18n describe blocks (unit, `blockWith()` helper) per REQ-21.x |
| `src/citability/__tests__/index.test.ts` | Modify | scorePage over the ES landing fixture (WU-4) |
| `src/citability/__fixtures__/page-es-landing.html` | Create | Small ES landing: 2-3 H2 blocks, first block "Relevy es una plataforma…" |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | REQ-21.1/21.2 answer patterns | `blockWith()` ES sentences → exact answer score, RED→GREEN |
| Unit | REQ-21.3 uniqueness signals | `blockWith()` ES leads/bodies → exact uniqueness score |
| Unit | REQ-21.4 bad leads | `blockWith()` ES pronoun/conjunction leads → selfContainment < 30 |
| Regression | REQ-21.5 | Full existing suite untouched must stay green (fixtures EN = red net) |
| Integration | ES landing | `scorePage(page-es-landing.html)`: definition block answer ≥ 60; record pageScore (proposal target ~75-85) |

Verify note (out of scope): `pnpm verify:scorehero` and `src/app/score-hero-evidence.ts` re-pin may go stale once the ES score rises — post-deploy re-pin is a verify-phase follow-up, not part of this change.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure pattern constants and unit tests.

## Migration / Rollout

No migration required — no data, no feature flags. Rollback: `git revert` of the constants/test commits restores EN-only behavior; impact isolated to the citability scorer.

## Open Questions

None — discrepancies resolved in the decisions above.
