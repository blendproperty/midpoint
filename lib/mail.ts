import nodemailer from "nodemailer";

// Minimal SMTP wrapper for transactional emails (currently just password
// resets). Configure via SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS /
// SMTP_FROM in the environment — works with any standard SMTP provider
// (Gmail app password, SendGrid, Mailgun, your own mail server, etc).
//
// If unset, logs a clear warning and returns false rather than throwing.
// Callers should still show the user a generic "check your email" message
// either way, so this never leaks whether an account/email exists.
export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) {
    console.error(
      "SMTP is not configured (set SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM) — email not sent:",
      { to, subject }
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({ from, to, subject, html });
    return true;
  } catch (err) {
    console.error("Failed to send email", err);
    return false;
  }
}
