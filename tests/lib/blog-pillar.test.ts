import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), pillar: vi.fn(), create: vi.fn(), update: vi.fn(), findPost: vi.fn() }));
vi.mock("@/lib/require-admin", () => ({ requireAdmin: mocks.auth }));
vi.mock("@/lib/prisma", () => ({ prisma: { pillarPage: { findUnique: mocks.pillar }, blogPost: { create: mocks.create, update: mocks.update, findUnique: mocks.findPost } } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/indexnow", () => ({ submitToIndexNow: vi.fn() }));
import { createBlogPost, updateBlogPost } from "@/app/admin/(protected)/blog/actions";

function form(pillarPageId: string) {
  const data = new FormData();
  data.set("title", "Warehouse question");
  data.set("pillarPageId", pillarPageId);
  return data;
}

describe("editor-assigned blog pillar relationship", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ sub: "editor" });
    mocks.pillar.mockResolvedValue({ id: "warehouse-guide" });
    mocks.findPost.mockResolvedValue({ publishedAt: null });
  });
  it("requires authentication before reading relationships or writing", async () => {
    mocks.auth.mockRejectedValue(new Error("Unauthorized"));
    await expect(createBlogPost(form("warehouse-guide"))).rejects.toThrow("Unauthorized");
    await expect(updateBlogPost("post", form("warehouse-guide"))).rejects.toThrow("Unauthorized");
    expect(mocks.pillar).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("persists the chosen pillar when creating and changing an article", async () => {
    await createBlogPost(form("warehouse-guide"));
    await updateBlogPost("post", form("warehouse-guide"));
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ pillarPageId: "warehouse-guide" }) }));
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ pillarPageId: "warehouse-guide" }) }));
  });
  it("rejects an unknown pillar before saving", async () => {
    mocks.pillar.mockResolvedValue(null);
    await expect(createBlogPost(form("missing"))).rejects.toThrow("existing pillar");
    await expect(updateBlogPost("post", form("missing"))).rejects.toThrow("existing pillar");
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("allows standalone posts and explicitly removing a relationship", async () => {
    await createBlogPost(form(""));
    await updateBlogPost("post", form(""));
    expect(mocks.pillar).not.toHaveBeenCalled();
    expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ pillarPageId: null }) }));
  });
});
