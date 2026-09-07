import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * LND-20.2 (sprint 20): the five Next.js scaffold SVGs with no consumers -
 * public/next.svg, vercel.svg, window.svg, globe.svg, file.svg - MUST be
 * removed from the repository (verified: 0 references in src/ and app/).
 *
 * The reference scan uses a whole-token pattern (`\b…\.svg\b`) so longer
 * names that merely CONTAIN one of the stems (e.g. `profile.svg`) never
 * false-positive; a positive control proves the scan actually runs.
 * The test file itself defines the five literals, so it is excluded from
 * its own scan (self-reference guard).
 */
const STARTER_SVGS = [
  "next.svg",
  "vercel.svg",
  "window.svg",
  "globe.svg",
  "file.svg",
];

const SELF_FILE = __filename;

const STARTER_REF = new RegExp(
  `\\b(?:${STARTER_SVGS.map((svg) => svg.replace(/\.svg$/, "")).join("|")})\\.svg\\b`,
);

/** Text-ish extensions worth scanning for references. */
const TEXT_EXT =
  /\.(?:ts|tsx|js|jsx|mjs|cjs|css|html|json|md|mdx|txt|svg|xml|yml|yaml)$/;

/** Recursive file listing under a source root (skips node_modules/.next). */
function listSourceFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (TEXT_EXT.test(entry.name)) out.push(full);
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}

/** src/ + app/ files (app/ only exists in non-src layouts - defensive). */
function scanRoots(): string[] {
  const cwd = process.cwd();
  return [
    ...listSourceFiles(join(cwd, "src")),
    ...listSourceFiles(join(cwd, "app")),
  ].filter((file) => file !== SELF_FILE);
}

describe("starter SVGs removed (LND-20.2)", () => {
  it("removes the five Next.js starter SVGs from public/", () => {
    for (const svg of STARTER_SVGS) {
      expect(existsSync(join(process.cwd(), "public", svg))).toBe(false);
    }
  });

  it("leaves zero references to the starter SVGs in src/ and app/", () => {
    const hits: string[] = [];
    for (const file of scanRoots()) {
      if (STARTER_REF.test(readFileSync(file, "utf8"))) {
        hits.push(relative(process.cwd(), file));
      }
    }
    expect(hits).toEqual([]);
  });

  it("still finds real asset references (scanner sanity check)", () => {
    // Positive control: og.png IS referenced by the shared OG helper, so the
    // reference scan above genuinely runs and is not a vacuous zero-loop.
    const ogHits = scanRoots().filter((file) =>
      readFileSync(file, "utf8").includes("og.png"),
    );
    expect(ogHits.length).toBeGreaterThanOrEqual(1);
  });
});
