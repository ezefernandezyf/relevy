import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND_DESCRIPTOR, BRAND_NAME } from "@/lib/brand";
import { buildOgMetadata, OG_IMAGE } from "@/lib/og";

/**
 * C16 - shared OG/Twitter metadata builder (LND-8).
 *
 * The helper is the single source for the OpenGraph + Twitter card fields
 * emitted by the public marketing pages (landing, login, signup - both reuse
 * the page's own title/description and reference the shared 1200×630
 * `public/og.png` asset). Sprint 10 removed the pricing page (PRC-8); the
 * generic route example below uses `/login`.
 */
describe("buildOgMetadata (C1.1, LND-8)", () => {
  const meta = buildOgMetadata({
    title: "Iniciar sesión",
    description: "Descripción de prueba.",
    path: "/login",
  });

  it("keeps the page title and description", () => {
    expect(meta.title).toBe("Iniciar sesión");
    expect(meta.description).toBe("Descripción de prueba.");
  });

  it("emits the OpenGraph fields (title, description, url, siteName, image, locale, type)", () => {
    expect(meta.openGraph).toMatchObject({
      title: "Iniciar sesión",
      description: "Descripción de prueba.",
      url: "/login",
      siteName: BRAND_NAME,
      locale: "es_AR",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${BRAND_NAME} - ${BRAND_DESCRIPTOR}`,
        },
      ],
    });
  });

  it("emits a summary_large_image Twitter card referencing og.png", () => {
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Iniciar sesión",
      description: "Descripción de prueba.",
      images: ["/og.png"],
    });
  });

  it("sets the canonical URL to the page path", () => {
    expect(meta.alternates?.canonical).toBe("/login");
  });
});

/** C16 - the shared OG asset the metadata references (C1.2). */
describe("OG asset (C1.2)", () => {
  it("ships public/og.png at the standard 1200×630 size", () => {
    const file = join(process.cwd(), "public", "og.png");
    expect(existsSync(file)).toBe(true);
    // PNG signature + IHDR: width/height are big-endian uint32 at bytes 16..24.
    const buf = readFileSync(file);
    expect(buf.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
  });

  // LND-8 (sprint 20): the shipped og.png is the PRE-REBRAND Next.js default
  // (dated 2026-08-25, sha256 9e854ba0...) and MUST be regenerated with the
  // Relevy mark from src/app/icon.svg. This assertion is the automated RED
  // gate for that MANUAL task - it fails until the user regenerates the asset.
  //
  // MANUAL GENERATION INSTRUCTIONS (user task, T4 - not automated):
  //   1. Open src/app/icon.svg (the current Relevy mark, 2026-08-25+).
  //   2. Export/convert it to PNG at exactly 1200×630:
  //        Inkscape: inkscape src/app/icon.svg --export-type=png \
  //                  --export-filename=public/og.png --export-width=1200 \
  //                  --export-height=630
  //        rsvg-convert: rsvg-convert -w 1200 -h 630 src/app/icon.svg \
  //                      -o public/og.png
  //        Or Figma: paste the mark on a 1200×630 frame and Export as PNG.
  //   3. Replace public/og.png and confirm this test turns GREEN.
  //   Visual check against src/app/icon.svg is recorded in the verify phase.
  it("differs from the pre-rebrand default asset (LND-8)", () => {
    const file = join(process.cwd(), "public", "og.png");
    expect(existsSync(file)).toBe(true);
    const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
    // The 2026-08-25 asset is the unmodified Next.js starter image - the
    // regenerated Relevy mark MUST produce a different content hash.
    expect(hash).not.toBe(
      "9e854ba0d92fe0fe81c88510eba501c53ae217bca2c6033f64c56c0982701de6",
    );
  });

  it("carries the Relevy brand in the shared OG alt (SHL-9)", () => {
    expect(OG_IMAGE.alt).toBe(`${BRAND_NAME} - ${BRAND_DESCRIPTOR}`);
  });
});
