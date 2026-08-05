import { describe, expect, it } from "vitest";
import { removeDuplicateCoverImage } from "@/lib/blog-content";

describe("removeDuplicateCoverImage", () => {
  it("removes the first body image when it duplicates the cover", () => {
    const html = '<p><img src="/uploads/warehouse.jpg" alt="Warehouse"></p><p>Article text</p>';

    expect(removeDuplicateCoverImage(html, "/uploads/warehouse.jpg")).toBe("<p>Article text</p>");
  });

  it("preserves other article images", () => {
    const html = '<p><img src="/uploads/loading-yard.jpg"></p><p>Article text</p>';

    expect(removeDuplicateCoverImage(html, "/uploads/warehouse.jpg")).toBe(html);
  });

  it("removes only one matching image", () => {
    const html = '<img src="/uploads/warehouse.jpg"><p>Text</p><img src="/uploads/warehouse.jpg">';

    expect(removeDuplicateCoverImage(html, "/uploads/warehouse.jpg")).toBe(
      '<p>Text</p><img src="/uploads/warehouse.jpg">',
    );
  });

  it("recognises editor-generated relative paths as the same cover image", () => {
    const html = '<p><img src="../../../api/uploads/warehouse.jpg" alt="Warehouse"></p><p>Article text</p>';

    expect(removeDuplicateCoverImage(html, "/api/uploads/warehouse.jpg")).toBe("<p>Article text</p>");
  });
});
