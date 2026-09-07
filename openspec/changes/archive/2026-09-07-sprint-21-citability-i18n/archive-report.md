# Archive Report: Sprint 21 — Citability i18n (ES)

- **Change**: `2026-09-07-sprint-21-citability-i18n`
- **Archived**: 2026-09-07
- **Project**: Relevy (repo local `geo-saas`, GitHub `relevy`)
- **Mode**: hybrid (OpenSpec + Engram)
- **Branch**: `feat/sprint-21-citability-i18n` (10 commits sobre develop `6e0f32a`; NO mergeada aún — el orquestador crea el PR a develop después del archive)

## Status at Close

- **Verdict**: PASS
- **Completeness**: 5/5 requirements (REQ-21.1..REQ-21.5), 10/10 scenarios compliant.
- **Tasks**: 14/14 checkboxes `[x]` en el artefacto persistido `tasks.md` (WU-1..WU-4). Zero unchecked tasks at close.
- **Tests**: `pnpm test` → 1119 passed / 0 failed / 4 skipped (118 files passed | 1 skipped); `pnpm run lint` → exit 0; `pnpm run typecheck` → exit 0 (build gate per repo convention — never build after changes).
- **Review gate**: no receipt-driven review artifacts exist for this candidate (no `reviewGate` en structured status; no review artifacts en el repo) — archivado bajo política ordinaria del repositorio.
- **Branch relationship**: merge-base con develop = `6e0f32a` (develop tip = PR #88, archive sprint-20). Commits del change en orden: `00d9ec5` propose → `66d7e3a` spec → `d246001` design → `1f7a1c2` tasks → `97d4966` answer ES → `86691d7` bad leads ES → `e7194f3` uniqueness ES → `6b90886` fixture ES + gates → `4441f70` mark tasks complete → `7920c47` verify.

## Alcance entregado (racional)

Sprint 21 hace i18n (ES) del engine de citabilidad: el landing en español de relevy.app puntuaba 49.9 porque el scorer solo reconocía patrones de answer block en inglés (25 bloques en `ans: 20`; Answer Block Quality = 30% del peso). Fix del ENGINE con patrones léxicos bilingües EN+ES en `constants.ts`, sin tocar pesos ni contenido.

1. **REQ-21.1 Definition ES**: `DEFINITION_PATTERN` += `es un/una` · `son unos/unas` (misma fuerza que EN "is a/an").
2. **REQ-21.2 Copula ES**: `ANSWER_COPULA` += `es son era eran fue fueron`; bonus first-sentence solo en primera frase declarativa completa ≤ 60 palabras (regla idéntica a EN).
3. **REQ-21.3 Uniqueness ES**: `FIRST_PERSON_LEAD` += `nuestro/nuestra/nosotros` (+`nosotras`, superset del proposal, verificado); `UNIQUENESS_PHRASES` += 8 frases ES normativas (enumeradas en el spec — "entrevistamos" NO incluida por diseño; el proposal listaba 9, el spec manda). Mismo crédito per-hit que EN (floor 35 + 35, cap 100).
4. **REQ-21.4 Bad leads ES**: `PRONOUN_LEAD` += `esto/eso/aquello/este/esta/estos/estas`; `CONJUNCTION_LEAD` += `pero/sin embargo/y además/así que/aunque` (`y\s+además` como UNA rama — leads "Y…" bare no penalizados). Self-Containment < 30 como EN.
5. **REQ-21.5 Regresión EN**: ramas EN intactas en cada regex/array; `scorer.ts` 0 cambios (confirmado por diff); fixtures EN con asserts de valor exacto verdes.

`scorer.ts`, `text.ts`, `rewrite.ts`, `index.ts`: zero changes. Sin cambios de pesos ni contenido landing.

## Delivery Notes

- Implementación in-place en `src/citability/constants.ts` bajo los mismos export names (design D1). TDD estricto: RED→GREEN por work unit (tasks.md fases 1-4, un commit por fase).
- Fixture nuevo `src/citability/__fixtures__/page-es-landing.html`: pageScore 46.7 (block 1 "¿Qué es Relevy?" answer 100 → composite 62); con patterns EN-only daría 38.7 → la rama ES aporta +8.0 de lift (documentado en `index.test.ts`).
- Verify corrió en la branch `feat/sprint-21-citability-i18n` (tip `7920c47`); verify-report físico commiteado (`7920c47`).
- Commit de archive: `chore(sdd): archive sprint-21-citability-i18n` (conventional — título EN, descripción ES). Sin push, sin PR.

## Archive-time Reconciliation

**Engram tasks topic (#1928) stale**: la observación de Engram `sdd/sprint-21-citability-i18n/tasks` (#1928, creada por sdd-tasks a las 11:21) conserva los 14 checkboxes `- [ ]` sin marcar — es el snapshot pre-apply. El artefacto persistido del filesystem (`tasks.md`, actualizado por sdd-apply en `4441f70`) tiene los 14 `[x]`. Reconciliación en archive: upsert del topic de Engram con el contenido final `[x]` (evidencia: apply-progress #1929 — WU-1..WU-4 completos con commits por fase — + verify-report #1931 PASS + `tasks.md` FS con 14/14). El Task Completion Gate se validó contra el artefacto del filesystem (autoritativo en modo hybrid): 14/14 `[x]`, cero unchecked al close.

**Nota de conteo (discrepancia registrada, no resuelta en silencio)**: verify-report #1931 reporta "Tasks total 15 / complete 15"; el artefacto persistido tiene 14 checkboxes (WU-1..WU-4: 3+3+3+5). El conteo del verify es un error del snapshot intermedio; el artefacto persistido (fuente de verdad de completitud, rango superior según Final-State Authority) manda: 14/14 completos. Sin impacto funcional — los 14 están `[x]` y apply-progress #1929 corrobora.

## Verification Findings (carried to close, non-blocking)

Registradas como FOLLOW-UPS / notas, no como blockers:

- **SUGGESTION 1 (scorehero stale)**: `pnpm verify:scorehero` / `src/app/score-hero-evidence.ts` quedarán stale al subir el score ES (73.9). Re-pin post-deploy = follow-up de archive (design §Verify note + tasks 4.4). **Encolado** — ver Roadmap.
- **SUGGESTION 2 (4 tests skipped)**: pre-existentes (mismo count en sprint-20: 1106 passed / 4 skipped), ajenos al change — sin acción.

## Final-State Facts (from orchestrator, outrank intermediate snapshots)

- Verify: PASS (5/5 req, 10/10 escenarios, 1119 tests, lint/typecheck clean).
- Score relevy.app real: citabilidad 49.9 → **73.9** (fetch `https://relevy.app/` HTTP 200, 124 276 bytes, `scorePage()` → pageScore 73.9, coverage 100%, blockCount 25; bloques de definición `answer` 20 → 100).
- `scorer.ts`: 0 cambios (solo `constants.ts`).
- UNIQUENESS_PHRASES ES = 8 (normativo; "entrevistamos" omitido por diseño).
- Follow-up post-archive: re-pin `pnpm verify:scorehero` / `src/app/score-hero-evidence.ts` (score ES subió → evidencia stale).

## Spec Sync (delta → canonical)

| Domain | Action | Details |
|--------|--------|---------|
| citability-engine | Actualizado (merge de delta) | REQ-21.1..REQ-21.5 ADDED (5 requirements, 10 escenarios). Header actualizado (`sprint-11-rebrand-polish` + `sprint-21-citability-i18n` · Delta (MODIFIED + ADDED)); Purpose ampliado (nota Sprint 21); tabla de requisitos + bloques completos (verbatim del delta) + Compliance Matrix actualizadas. La tabla conserva el formato legacy de 4 columnas del spec (sin columna Status) — los RCI existentes no fueron re-etiquetados (convención previa de este archivo, ver merge sprint-14). |

`docs/SPRINT-ROADMAP.md` actualizado: Sprint 21 (Citability i18n) marcado archivado (1119 tests, PASS 5/5 · 10/10, score citability 73.9, branch NO mergeada); develop `6e0f32a`; Tests 1119; siguiente: PR `feat/sprint-21-citability-i18n` → develop; follow-up re-pin scorehero post-deploy.

## Mechanical Copy Evidence

Archival move performed with native shell. Snapshot recursivo pre-move comparado contra el folder archivado:

```text
$ diff -r <snapshot>/source openspec/changes/archive/2026-09-07-sprint-21-citability-i18n
(no output — byte-identical, exit 0)
```

5 archivos en el snapshot (design.md, proposal.md, specs/citability-engine/spec.md, tasks.md, verify-report.md), todos byte-idénticos tras `git mv` (git detectó los 5 como renames R). `archive-report.md` es additive-only (no existía en el snapshot fuente) y queda excluido de la comparación. Diff status 0 es la única evidencia de paso.

## Engram Traceability

Hybrid persistence. Observaciones de Engram LEÍDAS para esta fase (proyecto `geoaudit`):
- #1925 `sdd/sprint-21-citability-i18n/proposal` — cross-check con proposal.md (idéntico)
- #1926 `sdd/sprint-21-citability-i18n/spec` — cross-check con el delta spec (idéntico)
- #1927 `sdd/sprint-21-citability-i18n/design` — cross-check con design.md (idéntico)
- #1928 `sdd/sprint-21-citability-i18n/tasks` — snapshot pre-apply; reconciliado por upsert (ver Archive-time Reconciliation)
- #1929 `sdd/sprint-21-citability-i18n/apply-progress` — evidencia de completitud WU-1..WU-4 + score real 73.9
- #1931 `sdd/sprint-21-citability-i18n/verify-report` — cross-check del verify-report físico (idéntico en contenido y frontmatter)

Archive report persistido en Engram como `sdd/sprint-21-citability-i18n/archive-report` (proyecto `geoaudit`, tipo architecture, capture_prompt false).

## Roadmap

`docs/SPRINT-ROADMAP.md` actualizado: Sprint 21 (Citability i18n) archivado (1119 tests, PASS 5/5 · 10/10, citabilidad relevy.app 49.9 → 73.9, branch `feat/sprint-21-citability-i18n` NO mergeada); siguiente: PR a develop (orquestador), luego re-pin `verify:scorehero` post-deploy, luego merge milestone `develop` → `main`.