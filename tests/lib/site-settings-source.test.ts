import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

describe("canonical WhatsApp number", () => {
  it("uses the Blend Property Group WhatsApp number in fallback, seed, and migration", () => {
    const settings = fs.readFileSync(path.join(projectRoot, "lib/site-settings.ts"), "utf8");
    const seed = fs.readFileSync(path.join(projectRoot, "prisma/seed.ts"), "utf8");
    const migration = fs.readFileSync(
      path.join(projectRoot, "prisma/migrations/20260909120000_update_whatsapp_number/migration.sql"),
      "utf8",
    );

    expect(settings).toContain('DEFAULT_WHATSAPP_NUMBER = "27600185206"');
    expect(seed).toContain('whatsapp: "27600185206"');
    expect(migration).toContain("'27600185206'");
  });
});
