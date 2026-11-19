import { isJobEnquiry, isObviousJunk } from "./leasing-enquiry-validation";

/** Shared by the browser and API. This checks useful input, not legal registration. */
export const COMPANY_MAX_LENGTH = 150;
export const COMPANY_ERROR = "Enter your company or trading name. Private, N/A and job enquiries are not accepted here.";

const placeholders = new Set([
  "blah", "blah blah", "na company", "not available", "no", "student", "retired", "self", "private person",
  "bs", "bullshit", "nonsense", "asdfgh", "qwertyuiop", "private", "private individual", "personal", "individual", "none", "na", "nil", "null",
  "n a", "not applicable", "no company", "no business", "not employed", "unemployed", "job", "jobs",
  "job seeker", "jobseeker", "looking for work", "looking for a job", "seeking employment",
  "test", "testing", "not sure", "nothing", "no company name", "no name", "no employer",
  "currently unemployed", "unemployment", "self employed", "myself",
  "job application", "work seeker", "looking for employment", "looking for job", "seeking a job",
  "cv", "resume", "any job", "abc123", "qwerty123", "asdf", "qwerty", "xxx", "unknown", "company", "company name", "business name",
]);

const compactPlaceholders = new Set([...placeholders].map((name) => name.replace(/\s/g, "")));

export function validateCompany(value: unknown): { company: string; error: string | null } {
  if (typeof value !== "string") return { company: "", error: COMPANY_ERROR };
  const company = value.normalize("NFKC").trim().replace(/\s+/gu, " ");
  const key = company.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim().replace(/\s+/gu, " ");
  // Exact normalized placeholders only: names like Private Equity Partners remain valid.
  const invalid = !company || company.length > COMPANY_MAX_LENGTH ||
    /[\p{Cc}\p{Cf}]/u.test(value) || isObviousJunk(company) ||
    isJobEnquiry(company) || compactPlaceholders.has(key.replace(/\s/g, ""));
  return { company, error: invalid ? COMPANY_ERROR : null };
}
