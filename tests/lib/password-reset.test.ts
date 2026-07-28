import { describe, it, expect } from "vitest";
import { hashToken } from "@/lib/password-reset";

describe("hashToken", () => {
  it("is deterministic for the same input", () => {
    expect(hashToken("abc123")).toBe(hashToken("abc123"));
  });

  it("produces different hashes for different inputs", () => {
    expect(hashToken("abc123")).not.toBe(hashToken("abc124"));
  });

  it("never returns the raw token back (it must only ever be stored hashed)", () => {
    const token = "super-secret-raw-token";
    expect(hashToken(token)).not.toBe(token);
  });
});
