import { describe, expect, it } from "vitest";
import { readBoundedJson } from "@/lib/request-body";

describe("bounded public intake", () => {
  it("preserves normal enquiry fields and attribution", async () => {
    const payload = { firstName: "Local", message: "Viewing enquiry", attribution: { source: "test" } };
    expect(await readBoundedJson(new Request("http://localhost", { method: "POST", body: JSON.stringify(payload) }))).toEqual(payload);
  });
  it("rejects declared excessive bodies before consuming the stream", async () => {
    const request = new Request("http://localhost", { method: "POST", headers: { "content-length": "1000000" }, body: "{}" });
    await expect(readBoundedJson(request)).rejects.toMatchObject({ status: 413 });
    expect(request.bodyUsed).toBe(false);
  });
  it("counts UTF-8 bytes without a content-length header and cancels excessive streams", async () => {
    const request = new Request("http://localhost", { method: "POST", body: JSON.stringify({ message: "é".repeat(100) }) });
    await expect(readBoundedJson(request, 150)).rejects.toMatchObject({ status: 413 });
  });
  it.each(["{", "[]", "null", '"value"'])("returns a controlled 400 for %s", async body => {
    await expect(readBoundedJson(new Request("http://localhost", { method: "POST", body }))).rejects.toMatchObject({ status: 400 });
  });
});
