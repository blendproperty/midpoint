import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { optimizeImageBuffer } from "@/lib/uploads";

describe("optimizeImageBuffer", () => {
  it("resizes oversized uploads and converts them to WebP", async () => {
    const source = await sharp({
      create: {
        width: 3000,
        height: 1500,
        channels: 3,
        background: { r: 30, g: 180, b: 200 },
      },
    })
      .jpeg({ quality: 95 })
      .toBuffer();

    const optimized = await optimizeImageBuffer(source);
    const metadata = await sharp(optimized).metadata();

    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(2000);
    expect(metadata.height).toBe(1000);
    expect(optimized.byteLength).toBeLessThan(source.byteLength);
  });

  it("does not enlarge smaller images", async () => {
    const source = await sharp({
      create: {
        width: 800,
        height: 600,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();

    const metadata = await sharp(await optimizeImageBuffer(source)).metadata();

    expect(metadata.width).toBe(800);
    expect(metadata.height).toBe(600);
    expect(metadata.format).toBe("webp");
  });
});
