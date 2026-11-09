import { describe, expect, it } from "vitest";
import { validateCompany } from "@/lib/company-validation";

describe("company name validation", () => {
  it.each(["Private Equity Partners", "Private Company (Pty) Ltd", "None Such Logistics", "N/A Engineering", "3M", "AB", "AAA", "A & B", "O'Brien & Sons", "Müller AG", "王记商贸", "A", "Test Equipment Supplies", "Acme (Pty) Ltd", "Jean Smith Trading"])("accepts plausible business names: %s", (company) => {
    expect(validateCompany(company)).toEqual({ company, error: null });
  });
  it.each([undefined, 123, {}, [], "", " ", "blah", "blah blah", "n/a company", "not available", "no", "student", "retired", "self", "private person", "Private", "PRIVATE.", "P r i v a t e", "B.S.", " b s ", "Bullshit", "Pri\u200bvate", "Ｎ／Ａ", "N / A", "N/A", "none", "test", "job seeker", "unemployed", "---", "12345", "aaaaaa", "Acme\u200b", "Acme\nLtd", "A".repeat(151)])("rejects unusable input: %j", (company) => {
    expect(validateCompany(company).error).toBeTruthy();
  });
  it("normalizes whitespace", () => expect(validateCompany("  Acme   Logistics  ")).toEqual({ company: "Acme Logistics", error: null }));
});
