import { PDFDocument, StandardFonts, rgb, PDFString, type PDFFont } from "pdf-lib";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { decode } from "html-entities";
import { vacancyLabel, vacancyDetailHref, vacancySize, vacancyRate, vacancyAvailability, type VacancyListing } from "@/lib/vacancy-shared";

const SITE = "https://www.mid-point.co.za";
const DARK = rgb(8 / 255, 33 / 255, 33 / 255);
const CYAN = rgb(57 / 255, 234 / 255, 230 / 255);
const MUTED = rgb(.37, .42, .44);
const WHITE = rgb(1, 1, 1);
const ALLOWED_IMAGES = new Set(["www.mid-point.co.za", "mid-point.co.za", "listings.blendproperty.co.za", "cdn.prod.website-files.com"]);
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

// Only the listing's saved image is used. Never accept asset URLs from callers,
// follow redirects, or fetch arbitrary hosts/private addresses.
export function brochureImageUrl(source: string): URL | null {
  try {
    const url = new URL(source, SITE);
    if (!source || url.protocol !== "https:" || url.port || url.username || url.password || !ALLOWED_IMAGES.has(url.hostname)) return null;
    return url;
  } catch { return null; }
}

export async function brochurePhoto(source: string): Promise<Buffer | null> {
  const url = brochureImageUrl(source);
  if (!url) return null;
  try {
    const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) return null;
    if (Number(response.headers.get("content-length")) > MAX_IMAGE_BYTES) return null;
    const reader = response.body?.getReader();
    if (!reader) return null;
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_IMAGE_BYTES) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    return await sharp(Buffer.concat(chunks), { limitInputPixels: 40_000_000 })
      .rotate().resize(1500, 470, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
  } catch { return null; }
}

export function brochureFilename(listing: VacancyListing) {
  const name = vacancyLabel(listing).normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 100);
  return `midpoint-${name || "space"}.pdf`;
}

// Standard PDF fonts handle Latin property names and m². Unsupported symbols
// are replaced per character so unusual CMS content cannot break a download.
function pdfText(value: string, font: PDFFont) {
  return Array.from(decode(value).replace(/[✅✔✓☑🔹]/g, " • ").replace(/[\u200d\ufe0f]/g, "").replace(/\s+/g, " ").trim()).map((char) => {
    try { font.encodeText(char); return char; } catch { return "?"; }
  }).join("");
}

function wrap(value: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of pdfText(value, font).split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) { line = candidate; continue; }
    if (line) { lines.push(line); line = ""; }
    // Split even an unusually long unbroken CMS word/URL safely.
    for (const char of word) {
      if (font.widthOfTextAtSize(line + char, size) > width) { lines.push(line); line = ""; }
      line += char;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export type BrochureContact = { phone: string; email: string };

export async function createVacancyBrochure(listing: VacancyListing, contact: BrochureContact, options: { photo?: Buffer | null; logo?: Buffer; now?: Date } = {}) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const label = vacancyLabel(listing);
  const detailUrl = SITE + vacancyDetailHref(listing);
  const date = options.now || new Date();
  pdf.setTitle(`${label} | Midpoint space to let`);
  pdf.setAuthor("Midpoint");
  pdf.setSubject("Midpoint, Halfway House, Midrand - space to let");
  pdf.setCreationDate(date);
  const logo = await pdf.embedPng(Uint8Array.from(options.logo || await readFile(path.join(process.cwd(), "public/images/brand/midpoint-brochure-logo.png"))));
  const photoBytes = options.photo === undefined ? await brochurePhoto(listing.image) : options.photo;
  const photo = photoBytes ? await pdf.embedJpg(Uint8Array.from(photoBytes)) : null;
  const width = 595.28, height = 841.89, margin = 36, contentWidth = width - margin * 2;
  let page = pdf.addPage([width, height]);
  const text = (value: string, x: number, top: number, size = 10, strong = false, color = DARK) => {
    page.drawText(pdfText(value, strong ? bold : regular), { x, y: height - top - size, size, font: strong ? bold : regular, color });
  };
  const rect = (x: number, top: number, w: number, h: number, color = DARK) => page.drawRectangle({ x, y: height - top - h, width: w, height: h, color });
  const link = (url: string, x: number, top: number, w: number, h: number) => {
    const annotation = pdf.context.register(pdf.context.obj({ Type: "Annot", Subtype: "Link", Rect: [x, height - top - h, x + w, height - top], Border: [0, 0, 0], A: { Type: "Action", S: "URI", URI: PDFString.of(url) } }));
    page.node.addAnnot(annotation);
  };
  const header = () => {
    rect(0, 0, width, 76);
    page.drawImage(logo, { x: margin, y: height - 51, width: 157, height: 31 });
    text("SPACE TO LET", 415, 25, 9, true, CYAN);
    text("HALFWAY HOUSE, MIDRAND", 386, 44, 8, false, WHITE);
  };
  const footer = (pageNumber: number) => {
    text("Information, measurements, pricing and availability are subject to confirmation.", margin, 689, 7, false, MUTED);
    text("This brochure reflects advertised vacancy information at the time of generation.", margin, 698, 7, false, MUTED);
    rect(margin, 710, contentWidth, 83);
    text("Find your next space at Midpoint.", margin + 16, 723, 16, true, WHITE);
    text(`${contact.phone}  |  ${contact.email}`, margin + 16, 750, 10, false, WHITE);
    text("View this space & arrange a viewing", margin + 16, 773, 9, true, CYAN);
    link(detailUrl, margin + 16, 771, 240, 15);
    link(`mailto:${contact.email}?subject=${encodeURIComponent(`Midpoint enquiry - ${label}`)}`, margin + 130, 749, 340, 15);
    text("162 Tonetti Street, Halfway House, Midrand 1685  |  www.mid-point.co.za", margin, 802, 8, false, MUTED);
    text(`Generated ${date.toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg" })}  |  Page ${pageNumber}`, margin, 818, 7, false, MUTED);
    link(detailUrl, margin, 799, contentWidth, 15);
  };
  header();
  text(listing.sector.toUpperCase(), margin, 92, 9, true, MUTED);
  const titleLines = wrap(listing.unitName || listing.building, bold, 24, contentWidth);
  let y = 112;
  for (const line of titleLines) { text(line, margin, y, 24, true); y += 29; }
  if (listing.unitName) { text(listing.building, margin, y + 2, 10, false, MUTED); y += 18; }
  y += 12;
  if (photo) page.drawImage(photo, { x: margin, y: height - y - 164, width: contentWidth, height: 164 });
  else { rect(margin, y, contentWidth, 94, rgb(.92, .95, .95)); text("Photograph available from our leasing team", margin + 18, y + 39, 11, false, MUTED); }
  y += photo ? 180 : 110;
  const metrics = [["AVAILABLE AREA", vacancySize(listing.sizeSqm)], ["RATE / m² / MONTH", vacancyRate(listing.ratePerSqm)], ["AVAILABILITY", vacancyAvailability(listing.availability)]];
  const column = contentWidth / 3;
  const metricLines = metrics.map(([, value]) => wrap(value, bold, 13, column - 22));
  const metricsHeight = 35 + Math.max(...metricLines.map(lines => lines.length)) * 16;
  rect(margin, y, contentWidth, metricsHeight, rgb(.92, .97, .96));
  metrics.forEach(([heading], index) => {
    text(heading, margin + index * column + 12, y + 10, 8, false, MUTED);
    metricLines[index].forEach((line, i) => text(line, margin + index * column + 12, y + 28 + i * 16, 13, true));
  });
  y += metricsHeight + 12;
  text("Confirm VAT, parking and other charges with our leasing team.", margin, y, 8, false, MUTED);
  y += 26;
  let pageNumber = 1;
  const ensureRoom = (needed: number) => {
    if (y + needed <= 683) return;
    footer(pageNumber++);
    page = pdf.addPage([width, height]); header();
    text(label, margin, 92, 11, true); y = 121;
  };
  const paragraph = (value: string, strong = false) => {
    for (const line of wrap(value, strong ? bold : regular, strong ? 12 : 10, contentWidth)) {
      ensureRoom(16); text(line, margin, y, strong ? 12 : 10, strong); y += 15;
    }
    y += 9;
  };
  paragraph("The space", true);
  paragraph(listing.description || "Speak to the Midpoint leasing team for full details of this space.");
  const features = Array.from(new Set(listing.features.filter(Boolean)));
  if (features.length) {
    ensureRoom(50); paragraph("Highlights", true);
    for (let i = 0; i < features.length; i += 2) {
      const left = wrap(features[i], regular, 9, column * 1.5 - 26);
      const right = features[i + 1] ? wrap(features[i + 1], regular, 9, column * 1.5 - 26) : [];
      const rowHeight = Math.max(left.length, right.length) * 13 + 3;
      ensureRoom(rowHeight);
      [left, right].forEach((lines, c) => {
        if (!lines.length) return;
        rect(margin + c * contentWidth / 2, y + 4, 4, 4, CYAN);
        lines.forEach((line, j) => text(line, margin + c * contentWidth / 2 + 12, y + j * 13, 9));
      });
      y += rowHeight;
    }
  }
  footer(pageNumber);
  return pdf.save();
}
