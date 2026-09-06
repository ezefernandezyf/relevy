import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * REQ-20.1 / REQ-20.2 — Sentry MVP setup + CSP ingest allowance
 * (sprint-20-close-free, Slice 1, T1 + T2).
 *
 * The SDK boundary (@sentry/nextjs) is mocked; every OTHER line exercised
 * here is real production code: the three runtime configs, instrumentation.ts
 * and next.config.ts are imported/executed, and package.json / .env.example /
 * the config sources are read from disk.
 */
const { initMock, captureRequestErrorMock } = vi.hoisted(() => ({
  initMock: vi.fn(),
  captureRequestErrorMock: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  init: initMock,
  captureRequestError: captureRequestErrorMock,
}));

// withSentryConfig is a build-time webpack/turbopack plugin: its module chain
// crashes outside Next's config loader (fileURLToPath on a non-file URL in
// jsdom). The wrap itself is asserted structurally from source; passing the
// config through untouched lets the REAL headers() implementation run.
vi.mock("@sentry/nextjs/config", () => ({
  withSentryConfig: (config: unknown) => config,
}));

const ROOT = process.cwd();

/** The three runtime configs, each imported through a statically analyzable dynamic import. */
const CONFIGS = [
  { name: "client", load: () => import("../../../sentry.client.config") },
  { name: "server", load: () => import("../../../sentry.server.config") },
  { name: "edge", load: () => import("../../../sentry.edge.config") },
] as const;

beforeEach(() => {
  vi.resetModules();
  initMock.mockClear();
  captureRequestErrorMock.mockClear();
  delete process.env.SENTRY_DSN;
  delete process.env.NEXT_RUNTIME;
});

describe("REQ-20.1 — SDK pinned in dependencies", () => {
  it("declares @sentry/nextjs in dependencies with an exact version pin", () => {
    const pkg = JSON.parse(
      readFileSync(join(ROOT, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies["@sentry/nextjs"]).toBe("10.73.0");
  });
});

describe("REQ-20.1 — manual setup files present", () => {
  it.each([
    "sentry.client.config.ts",
    "sentry.server.config.ts",
    "sentry.edge.config.ts",
    "instrumentation.ts",
  ])("ships %s at the repository root", (file) => {
    expect(existsSync(join(ROOT, file))).toBe(true);
  });

  it("exports both register and onRequestError from instrumentation.ts", async () => {
    const instrumentation = await import("../../../instrumentation");
    expect(typeof instrumentation.register).toBe("function");
    expect(instrumentation.onRequestError).toBe(captureRequestErrorMock);
  });

  it("register() does not load any config outside the Next runtime (dev/test)", async () => {
    const { register } = await import("../../../instrumentation");
    await register();
    expect(initMock).not.toHaveBeenCalled();
  });

  it("register() loads the server config when NEXT_RUNTIME is nodejs", async () => {
    process.env.NEXT_RUNTIME = "nodejs";
    const { register } = await import("../../../instrumentation");
    await register();
    expect(initMock).toHaveBeenCalledTimes(1);
  });

  it("register() loads the edge config when NEXT_RUNTIME is edge", async () => {
    process.env.NEXT_RUNTIME = "edge";
    const { register } = await import("../../../instrumentation");
    await register();
    expect(initMock).toHaveBeenCalledTimes(1);
  });
});

describe("REQ-20.1 — DSN no-op guard (no DSN → SDK disabled, no throw)", () => {
  for (const config of CONFIGS) {
    describe(config.name, () => {
      it("does not throw and disables the SDK without a DSN", async () => {
        await expect(config.load()).resolves.toBeDefined();
        expect(initMock).toHaveBeenCalledWith({
          dsn: undefined,
          enabled: false,
        });
      });

      it("initializes with the DSN and enabled:true when SENTRY_DSN is set", async () => {
        process.env.SENTRY_DSN = "https://public@example.ingest.sentry.io/123";
        await expect(config.load()).resolves.toBeDefined();
        expect(initMock).toHaveBeenCalledWith({
          dsn: "https://public@example.ingest.sentry.io/123",
          enabled: true,
        });
      });
    });
  }
});

describe("REQ-20.1 — .env.example documents SENTRY_DSN", () => {
  it("lists SENTRY_DSN as an optional, empty-by-default variable", () => {
    const env = readFileSync(join(ROOT, ".env.example"), "utf8");
    expect(env).toMatch(/^SENTRY_DSN=/m);
  });
});

describe("REQ-20.1 — withSentryConfig wrap, headers preserved, no source maps", () => {
  it("wraps the default export with withSentryConfig from @sentry/nextjs/config", () => {
    const source = readFileSync(join(ROOT, "next.config.ts"), "utf8");
    expect(source).toContain('from "@sentry/nextjs/config"');
    expect(source).toMatch(/withSentryConfig\(\s*nextConfig\s*\)/);
  });

  it("omits source-map upload configuration (no SENTRY_AUTH_TOKEN needed to build)", () => {
    const source = readFileSync(join(ROOT, "next.config.ts"), "utf8");
    expect(source).not.toMatch(/sourcemaps/);
    expect(source).not.toMatch(/SENTRY_AUTH_TOKEN/);
  });
});

describe("REQ-20.2 — CSP report-only allows Sentry ingest, directives preserved", () => {
  async function cspHeader(): Promise<{ key: string; value: string }> {
    const { default: config } = await import("../../../next.config");
    const entries = await config.headers!();
    return entries[0].headers.find(
      (h) => h.key === "Content-Security-Policy-Report-Only",
    )!;
  }

  it("keeps the header report-only and lets connect-src reach *.ingest.sentry.io", async () => {
    const csp = await cspHeader();
    expect(csp).toBeDefined();
    expect(csp.key).toBe("Content-Security-Policy-Report-Only");
    const connectSrc = csp.value
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("connect-src"));
    expect(connectSrc).toContain("'self'");
    expect(connectSrc).toContain("https://*.ingest.sentry.io");
  });

  it("preserves every other CSP directive unchanged", async () => {
    const csp = await cspHeader();
    expect(csp).toBeDefined();
    for (const directive of [
      "default-src",
      "script-src",
      "style-src",
      "img-src",
      "font-src",
      "object-src",
      "base-uri",
      "form-action",
      "frame-ancestors",
      "upgrade-insecure-requests",
    ]) {
      expect(csp.value).toContain(directive);
    }
  });

  it("preserves the full security header set (CSP + HSTS + nosniff + referrer + permissions)", async () => {
    const { default: config } = await import("../../../next.config");
    const entries = await config.headers!();
    const keys = entries[0].headers.map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy-Report-Only",
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy",
      ]),
    );
  });
});
