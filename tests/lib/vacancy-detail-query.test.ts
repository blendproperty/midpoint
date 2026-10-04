import { beforeEach, expect, it, vi } from "vitest";
const findFirst = vi.hoisted(() => vi.fn());
vi.mock("@/lib/prisma", () => ({ prisma: { vacancy: { findFirst } } }));
import { getVacancyById } from "@/lib/vacancies";
beforeEach(() => { findFirst.mockReset(); });
it("fetches only the requested published record and retains public presentation", async () => {
  findFirst.mockResolvedValue({ id: "local-detail", building: "Local Warehousing", unitName: "Unit & one", sector: "OFFICE", sizeSqm: 150, ratePerSqm: 105.5, availability: "Confirm", description: "<p>Local &amp; test</p>", features: [], image: null });
  expect(await getVacancyById("local-detail")).toMatchObject({ sector: "Warehouse", description: "Local & test", unitName: "Unit & one", image: "" });
  expect(findFirst).toHaveBeenCalledTimes(1);
  expect(findFirst).toHaveBeenCalledWith({ where: { id: "local-detail", status: "PUBLISHED" } });
});
it("returns no listing when the published-record query finds nothing or fails", async () => {
  findFirst.mockResolvedValue(null);
  expect(await getVacancyById("draft-or-missing")).toBeNull();
  findFirst.mockRejectedValue(new Error("isolated database unavailable"));
  expect(await getVacancyById("local-detail")).toBeNull();
});
