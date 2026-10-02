import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("production migration safety", () => {
  it("overrides bootstrap seeding in automatic releases and retains deployment gates", () => {
    const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
    const commands = workflow.split(/\r?\n/).filter(line => /^\s*docker compose .*run --rm migrate\b/.test(line));
    expect(commands).toHaveLength(1);
    expect(commands[0].trim()).toBe("docker compose -f compose.prod.yml --profile tools run --rm migrate npx prisma migrate deploy");
    expect(workflow).not.toContain("prisma db seed");
    expect(workflow).toContain("needs: test");
    expect(workflow).toContain("BOOKING_INTEGRATION: \"1\"");
    expect(workflow).toContain("build web migrate");
    expect(workflow).toContain("up -d --no-build web");
  });

  it("keeps the bootstrap seed available for intentional setup", () => {
    const compose = readFileSync("compose.prod.yml", "utf8");
    expect(compose).toContain('command: sh -c "npx prisma migrate deploy && npx prisma db seed"');
    expect(compose).toContain("SEED_SUPERADMIN_EMAIL: ${SEED_SUPERADMIN_EMAIL}");
    expect(compose).toContain("SEED_SUPERADMIN_PASSWORD: ${SEED_SUPERADMIN_PASSWORD}");
  });
});
