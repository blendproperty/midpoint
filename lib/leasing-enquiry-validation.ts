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

export const LEASING_SPACE_TYPES = ["Office space", "Warehouse space", "Serviced offices"];
export const LEASING_MOVE_IN_OPTIONS = ["Immediately", "Within 1–3 months", "Within 3–6 months", "More than 6 months", "Still planning"];

const filler = new Set([
  "bs", "bullshit", "n/a", "na", "none", "null", "nil", "not applicable",
  "no idea", "no name", "first name", "last name", "unknown", "nothing", "nonsense", "whatever",
  "test", "testing", "foo", "foobar", "lorem ipsum", "dummy", "placeholder",
  "blah", "asdf", "asdfgh", "qwerty", "qwertyuiop", "abc123", "qwerty123", "xxx",
]);

export function isObviousJunk(value: string) {
  const words = value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const compact = words.replace(/ /g, "");
  // Match filler-only answers so short, useful text and real names survive.
  return !/\p{L}/u.test(words) || filler.has(words) || filler.has(compact) ||
    words.split(" ").every((word) => filler.has(word)) ||
    /^(.)\1{3,}$/u.test(compact) || /^(?:abc|asdf|qwerty|blah){2,}$/u.test(compact);
}

function isValidPhone(value: string) {
  if (!/^(?:\+|00)?[\d\s().-]+$/.test(value)) return false;
  const compact = value.replace(/[\s().-]/g, "").replace(/^00/, "+");
  const national = compact.startsWith("+27") ? compact.slice(3) :
    compact.startsWith("0") ? compact.slice(1) : "";
  const plausible = compact.startsWith("+27") || compact.startsWith("0")
    ? /^[1-9]\d{8}$/.test(national)
    : /^\+[1-9]\d{7,14}$/.test(compact);
  const digits = (national || compact).replace(/^\+/, "");
  return plausible && !/^(\d)\1+$/.test(digits) && !/^(?:123456789|987654321)$/.test(digits);
}

const validName = (value: string) => /^[\p{L}\p{M} .’'\p{Pd}\u00b7]+$/u.test(value) && !isObviousJunk(value);

export function leasingTextError(field: string, value: string) {
  switch (field) {
    case "firstName": return validName(value) ? null : "Enter your first name.";
    case "lastName": return validName(value) ? null : "Enter your last name.";
    case "phone": return isValidPhone(value) ? null : "Enter a valid phone number, such as 082 123 4567, or include your international country code.";
    case "spaceSize":
      return !isObviousJunk(value) && !isJobEnquiry(value) ? null : "Enter an approximate floor area, desk count or team size, such as 12 desks.";
    case "message":
      if (isJobEnquiry(value)) return JOB_ENQUIRY_ERROR;
      return !isObviousJunk(value) ? null : "Describe what you need from the space, such as loading access or parking.";
    default: return null;
  }
}
