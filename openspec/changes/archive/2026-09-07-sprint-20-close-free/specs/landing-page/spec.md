# Landing Page Specification — Delta

> **Change**: `sprint-20-close-free` · **Type**: Delta (MODIFIED + ADDED)

## MODIFIED Requirements

### Requirement: OG/SEO Tags (LND-8)

When the landing page renders, then it MUST emit OpenGraph and Twitter card metadata via the shared OG helper (reusing the default metadata with OG fields added), and the OpenGraph image MUST be the regenerated Relevy mark.

(Previously: `og.png` was the pre-rebrand asset from 2026-08-25; the OpenGraph image is now regenerated with the Relevy mark, referenced from `src/app/icon.svg`.)

#### Scenario: OG + Twitter tags present

- GIVEN the landing page
- WHEN it renders
- THEN `og:title`, `og:description`, `og:image`, and Twitter card tags are present

#### Scenario: og.png is the current Relevy mark

- GIVEN `public/og.png`
- WHEN it is inspected
- THEN it exists at 1200×630
- AND its content hash differs from the pre-rebrand default (`9e854ba0…`), matching the Relevy mark in `src/app/icon.svg`
- AND the human visual verification is documented in `verify-report`

#### Scenario: OG helper still references /og.png

- GIVEN `src/lib/og.ts`
- WHEN `OG_IMAGE` is inspected
- THEN it still points to `/og.png` at 1200×630
- AND the JSON-LD `logo`/`image` still reference the same asset

## ADDED Requirements

### Requirement: Launch Section (LND-20.1)

When the landing page renders, then it MUST include an honest launch section between the FAQ and the final CTA, in document order, that announces the product and the FREE plan without invented claims. The copy MUST live in `src/lib/copy.ts` (`LANDING_COPY.launch`), be neutral Spanish (passes the `VOSEO_PATTERN` invariant), sit in the 50-200 word band, and follow the existing design system (navy/emerald/amber, Instrument Serif/Work Sans). The copy MUST NOT invent tiers, unshipped features, or external posts.

#### Scenario: Section renders between FAQ and CTA

- GIVEN the landing page
- WHEN the sections are inspected in document order
- THEN a launch section renders after the FAQ and before the final CTA

#### Scenario: Honest live + FREE plan copy

- GIVEN the launch section copy
- WHEN it is inspected
- THEN it states the live product and the FREE plan (10 audits / 30 days)
- AND it makes no invented claims (no paid tiers, no unshipped features, no external posts)

#### Scenario: Copy centralized and ES neutral in the 50-200 band

- GIVEN `LANDING_COPY.launch` in `src/lib/copy.ts`
- WHEN it is inspected
- THEN it is between 50 and 200 words, passes the `VOSEO_PATTERN` invariant, and contains the strings "10 auditorías" and "30 días"

#### Scenario: Design system coherence

- GIVEN the launch section markup
- WHEN it is inspected
- THEN it uses the existing design tokens (`font-serif`, navy/emerald/amber) consistent with the rest of the landing

### Requirement: Starter SVGs Removed (LND-20.2)

When the landing/public assets render, then the starter SVGs without a consumer MUST be removed from `public/`: `next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg`. There MUST be zero references to these files in `src/` and `app/`.

#### Scenario: No starter SVGs in public/

- GIVEN `public/`
- WHEN the five starter SVGs are looked up
- THEN `next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, and `file.svg` are absent

#### Scenario: No consumer references break

- GIVEN the repository source
- WHEN references to the five starter SVGs are searched in `src/` and `app/`
- THEN there are zero references

## Compliance Matrix

| Requirement | Scenarios | Coverage |
|-------------|-----------|----------|
| LND-8 | OG + Twitter tags present, og.png is the current Relevy mark, OG helper still references /og.png | Covered |
| LND-20.1 | Section renders between FAQ and CTA, Honest live + FREE plan copy, Copy centralized and ES neutral in the 50-200 band, Design system coherence | Covered |
| LND-20.2 | No starter SVGs in public/, No consumer references break | Covered |
