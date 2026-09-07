import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Sprint 20 (Close Free) slice 3 — repo hygiene (PERF-1, REQ-20.3) and live
 * docs sync (REQ-20.4/20.5).
 *
 * PERF-1: the Lighthouse tooling was removed — no devDep, no npm script, no
 * `scripts/lighthouse.mjs` (broken since sprint 18: `import puppeteer` fails
 * with ERR_MODULE_NOT_FOUND), and `puppeteer-core` must be pruned from the
 * lockfile by a fresh `pnpm install`. The historical evidence in
 * `docs/performance.md` (last real scan 2026-08-25) stays as a record, with
 * the removal noted.
 *
 * REQ-20.3: the five orphaned TTFs under `public/fonts/` (0 references; fonts
 * load via `next/font/google` in `src/app/layout.tsx`) must be gone.
 *
 * REQ-20.4: the live docs set must carry the Relevy brand (0 case-sensitive
 * "GeoAudit" matches — the lowercase `geoaudit` DATABASE_URL value in ci.yml
 * is infra, not brand surface) and real stack claims (Sentry installed; no
 * Resend/PDF/Puppeteer as active features; weights v3.1.0 24/23/15/12/14/12;
 * Free plan 10 audits / 30 days).
 *
 * REQ-20.5: `docs/RELEVY-BRAND-BRIEF.md` must be tracked and consistent with
 * `src/lib/brand.ts` (Relevy / relevy.app / "AI Visibility & GEO Audit").
 */

const CWD = process.cwd();

const LIVE_DOCS = [
  "README.md",
  "AGENTS.md",
  "openspec/config.yaml",
  "pnpm-workspace.yaml",
  ".github/workflows/ci.yml",
  "docs/performance.md",
  "docs/SPRINT-ROADMAP.md",
];

const ORPHAN_TTFS = [
  "InstrumentSerif-Regular.ttf",
  "InstrumentSerif-Italic.ttf",
  "WorkSans-Regular.ttf",
  "WorkSans-Bold.ttf",
  "JetBrainsMono-Regular.ttf",
];

const SELF_FILE = __filename;

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
  return [
    ...listSourceFiles(join(CWD, "src")),
    ...listSourceFiles(join(CWD, "app")),
  ].filter((file) => file !== SELF_FILE);
}

function read(path: string): string {
  return readFileSync(join(CWD, path), "utf8");
}

describe("lighthouse tooling removed (PERF-1)", () => {
  it("removes the lighthouse devDependency from package.json", () => {
    const pkg = JSON.parse(read("package.json")) as {
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };
    expect(pkg.devDependencies?.["lighthouse"]).toBeUndefined();
    expect(pkg.scripts?.["lighthouse"]).toBeUndefined();
  });

  it("removes scripts/lighthouse.mjs", () => {
    expect(existsSync(join(CWD, "scripts", "lighthouse.mjs"))).toBe(false);
  });

  it("prunes puppeteer-core from the lockfile (W-2, orphan of lighthouse)", () => {
    const lock = read("pnpm-lock.yaml");
    // Positive control: the lockfile is real and non-trivial.
    expect(lock.length).toBeGreaterThan(1_000);
    expect(lock).not.toContain("puppeteer-core");
    expect(lock).not.toContain("lighthouse@");
  });

  it("keeps the last real measurement as historical evidence and notes the removal", () => {
    const perf = read("docs/performance.md");
    // PERF-2/PERF-3 historical record (sprint 8 WU-C3, last real scan):
    expect(perf).toContain("2026-08-25");
    // The tooling-removal note (measurement path no longer runnable):
    expect(perf).toContain("lighthouse");
  });
});

describe("orphan fonts removed (REQ-20.3)", () => {
  it("leaves no files under public/fonts/", () => {
    const fontsDir = join(CWD, "public", "fonts");
    if (existsSync(fontsDir)) {
      expect(readdirSync(fontsDir)).toEqual([]);
    }
  });

  it("leaves zero references to the five TTFs in src/ and app/", () => {
    const hits: string[] = [];
    for (const file of scanRoots()) {
      const content = readFileSync(file, "utf8");
      if (ORPHAN_TTFS.some((ttf) => content.includes(ttf))) {
        hits.push(relative(CWD, file));
      }
    }
    expect(hits).toEqual([]);
  });

  it("keeps next/font/google as the only font source (scanner sanity check)", () => {
    // Positive control: the layout really loads fonts via next/font/google,
    // proving the reference scan above runs on real content.
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("next/font/google");
    expect(layout).toContain("Instrument_Serif");
  });
});

describe("live docs carry the Relevy brand (REQ-20.4)", () => {
  it("has zero case-sensitive 'GeoAudit' matches across the live docs set", () => {
    const hits = LIVE_DOCS.filter((doc) => read(doc).includes("GeoAudit"));
    expect(hits).toEqual([]);
  });

  it("has zero 'GeoAudit' matches and positive Relevy presence (scan sanity check)", () => {
    // Positive control: the scan is not vacuous — every doc in the set
    // actually references the Relevy brand somewhere.
    for (const doc of LIVE_DOCS) {
      expect(read(doc)).toContain("Relevy");
    }
  });

  it("drops the false stack claims from README and lists Sentry + real weights", () => {
    const readme = read("README.md");
    expect(readme).not.toContain("Resend");
    expect(readme).not.toContain("Puppeteer");
    expect(readme).not.toContain("PDF");
    expect(readme).not.toContain("Peso (v2.0.0)");
    // Real stack: Sentry installed as monitoring.
    expect(readme).toContain("Sentry");
    // Real scoring weights v3.1.0 — six dimensions, brand authority 12 %.
    expect(readme).toContain("Peso (v3.1.0)");
    expect(readme).toMatch(/24\s*%/);
    expect(readme).toMatch(/23\s*%/);
    expect(readme).toMatch(/15\s*%/);
    expect(readme).toMatch(/12\s*%/);
    expect(readme).toMatch(/14\s*%/);
  });

  it("restates the Free plan honestly (10 audits / 30 days, no PDF or multi-page claims)", () => {
    const readme = read("README.md");
    expect(readme).toContain("10 auditorías");
    expect(readme).toContain("30 días");
    expect(readme).not.toContain("multi-página");
  });

  it("removes the stale 'PDF: Puppeteer' line from AGENTS.md", () => {
    const agents = read("AGENTS.md");
    expect(agents).not.toContain("PDF: Puppeteer");
    expect(agents).not.toContain("Resend");
    expect(agents).toContain("Sentry");
  });

  it("syncs openspec/config.yaml to Relevy with the real stack", () => {
    const config = read("openspec/config.yaml");
    expect(config).not.toContain("GeoAudit");
    expect(config).not.toContain("Resend");
    expect(config).not.toContain("Puppeteer");
    expect(config).toContain("Relevy");
    expect(config).toContain("Sentry");
  });

  it("drops the stale puppeteer allowBuild entry from pnpm-workspace.yaml", () => {
    const workspace = read("pnpm-workspace.yaml");
    expect(workspace).toContain("Relevy");
    expect(workspace).not.toContain("puppeteer");
  });

  it("carries the Relevy comment in ci.yml while keeping the infra geoaudit URL", () => {
    const ci = read(".github/workflows/ci.yml");
    expect(ci).toContain("Relevy");
    expect(ci).not.toContain("GeoAudit");
    // The lowercase geoaudit DATABASE_URL is infra, not brand surface — untouched.
    expect(ci).toContain("/geoaudit");
  });

  it("reflects the sprint 19 merge (296c719, PR #84) in the roadmap", () => {
    const roadmap = read("docs/SPRINT-ROADMAP.md");
    expect(roadmap).toContain("296c719");
    expect(roadmap).toContain("PR #84");
    // Sprint 19 is merged — no open-PR wording on that row.
    expect(roadmap).not.toContain("PR a develop en curso");
    // Main/Develop state updated past the sprint 18 commit (eeeaf3f).
    expect(roadmap).toContain("`296c719`");
    expect(roadmap).not.toContain("`eeeaf3f` / `eeeaf3f`");
  });
});

describe("brand brief committed (REQ-20.5)", () => {
  it("tracks docs/RELEVY-BRAND-BRIEF.md in git", () => {
    const tracked = execSync("git ls-files docs/RELEVY-BRAND-BRIEF.md", {
      cwd: CWD,
      encoding: "utf8",
    }).trim();
    expect(tracked).toBe("docs/RELEVY-BRAND-BRIEF.md");
  });

  it("is consistent with src/lib/brand.ts brand constants", () => {
    const brief = read("docs/RELEVY-BRAND-BRIEF.md");
    const brand = read("src/lib/brand.ts");
    // Brand name: Relevy, never the legacy name.
    expect(brief).toContain("Relevy");
    expect(brief).not.toContain("GeoAudit");
    // Domain + descriptor, if mentioned, must not contradict brand.ts.
    expect(brand).toContain("relevy.app");
    expect(brand).toContain("AI Visibility & GEO Audit");
    if (brief.includes("relevy.")) expect(brief).toContain("relevy.app");
    if (brief.includes("GEO Audit"))
      expect(brief).toContain("AI Visibility & GEO Audit");
  });
});
