import { expect, it } from "vitest";
import { vacancyDescriptionParagraphs } from "@/lib/vacancy-content";

it("separates Stellantis prose, size, contact, credit, condition and rentals without dropping text", () => {
  const source = "Bring your team to Midrand. Two-storey offices and training rooms. Reception and a canteen are included. Size: 2,183 m². Contact Boitumelo Nkuna for viewings. Photography: Stellantis / MediaWire, July 2023. Current layout, fit-out and included facilities to be confirmed. Rental: R115/m² per month. Monthly rental for 2,183 m²: R251,045.";
  const paragraphs = vacancyDescriptionParagraphs(source);
  expect(paragraphs).toEqual([
    "Bring your team to Midrand. Two-storey offices and training rooms.",
    "Reception and a canteen are included.",
    "Size: 2,183 m².",
    "Contact Boitumelo Nkuna for viewings.",
    "Photography: Stellantis / MediaWire, July 2023.",
    "Current layout, fit-out and included facilities to be confirmed.",
    "Rental: R115/m² per month.",
    "Monthly rental for 2,183 m²: R251,045.",
  ]);
  expect(paragraphs.join(" ")).toBe(source);
});

it("retains supplied paragraph, heading, list and line boundaries while rendering text safely", () => {
  expect(vacancyDescriptionParagraphs("<h3>Office G.02</h3><p>172.66 m&sup2; office.</p><p>Power: 2.5 MVA.<br>Ground floor.</p><ul><li>Private kitchen</li><li>Parking</li></ul><h3>Key <strong>Features</strong></h3> 🔹 Separate feature"))
    .toEqual(["Office G.02", "172.66 m² office.", "Power: 2.5 MVA.", "Ground floor.", "Private kitchen", "Parking"]);
});

it("preserves plain-text newlines, decimal specifications and empty descriptions", () => {
  expect(vacancyDescriptionParagraphs("15m height to eaves and 2.5 MVA.\nRental: R117.50 per m²."))
    .toEqual(["15m height to eaves and 2.5 MVA.", "Rental: R117.50 per m²."]);
  expect(vacancyDescriptionParagraphs("")).toEqual([]);
});
