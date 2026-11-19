export const JOB_ENQUIRY_ERROR = "This form is for leasing enquiries only. We do not accept job applications or CVs.";

const personalEmailDomains = new Set([
  "gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "hotmail.co.za", "live.com",
  "live.co.za", "msn.com", "yahoo.com", "yahoo.co.za", "ymail.com", "icloud.com", "me.com",
  "aol.com", "proton.me", "protonmail.com", "mail.com", "gmx.com", "webmail.co.za",
]);

const EMAIL_ERROR = "Enter a valid company email address.";
const PERSONAL_EMAIL_ERROR = "Use your company email address. Gmail and other personal email addresses are blocked.";

export function validateBusinessEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim() : "";
  const domain = email.split("@").at(-1)?.toLowerCase() ?? "";
  if (email.length > 254 || !/^[^\s@]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email)) {
    return { email, error: EMAIL_ERROR };
  }
  // shortcut: known consumer domains only, add domain verification if staff need proof of ownership.
  return { email, error: personalEmailDomains.has(domain) ? PERSONAL_EMAIL_ERROR : null };
}

export function isJobEnquiry(value: unknown) {
  if (typeof value !== "string") return false;
  const text = value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ");
  return /\b(?:looking|searching) for (?:a |any )?(?:jobs?|employment)\b/u.test(text)
    || /\b(?:applying|apply) for (?:a |the |any )?(?:job|position|internship|learnership)\b/u.test(text)
    || /\b(?:my|me) (?:cv|curriculum vitae)\b/u.test(text)
    || /\b(?:send|submit|attach) (?:my )?(?:cv|curriculum vitae)\b/u.test(text)
    || /\bare you hiring\b/u.test(text);
}
