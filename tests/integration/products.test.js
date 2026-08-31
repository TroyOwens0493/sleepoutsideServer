import { beforeEach, describe, expect, it, vi } from "vitest";

const collection = {
  countDocuments: vi.fn(),
  find: vi.fn(),
};

vi.mock("../../src/database/index.mts", () => ({
  default: {
    getDb: () => ({ collection: () => collection }),
  },
}));

describe("product search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.countDocuments.mockResolvedValue(1);
    collection.find.mockReturnValue({
      skip: () => ({
        limit: () => ({
          project: vi.fn(),
          toArray: async () => [{ id: "880RR", name: "Marmot Ajax Tent" }],
        }),
      }),
    });
  });

  it("builds a case-insensitive text search across product fields", async () => {
    const productService = (await import("../../src/services/product.service.mts"))
      .default;

    const result = await productService.getAllProducts({ q: "Ajax" });

    expect(collection.find).toHaveBeenCalledWith({
      $or: [
        { name: { $regex: "Ajax", $options: "i" } },
        { nameWithoutBrand: { $regex: "Ajax", $options: "i" } },
        { descriptionHtmlSimple: { $regex: "Ajax", $options: "i" } },
        { category: { $regex: "Ajax", $options: "i" } },
      ],
    });
    expect(result.results).toEqual([{ id: "880RR", name: "Marmot Ajax Tent" }]);
  });

  it("keeps category as a required filter when searching within a category", async () => {
    const productService = (await import("../../src/services/product.service.mts"))
      .default;

    await productService.getAllProducts({ category: "tents", q: "three season" });

    expect(collection.find).toHaveBeenCalledWith(
      expect.objectContaining({ category: "tents", $or: expect.any(Array) }),
    );
  });

  it("treats regular-expression characters as literal search text", async () => {
    const productService = (await import("../../src/services/product.service.mts"))
      .default;

    await productService.getAllProducts({ q: "tent.*" });

    expect(collection.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          { name: { $regex: "tent\\.\\*", $options: "i" } },
        ]),
      }),
    );
  });
});
