import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const cursor = {
  skip: vi.fn(),
  limit: vi.fn(),
  project: vi.fn(),
  toArray: vi.fn(),
};
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
  let server;
  let baseUrl;

  beforeAll(async () => {
    const app = (await import("../../src/app.ts")).default;
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}/api/v1/products/`;
  });

  afterAll(() => new Promise((resolve) => server.close(resolve)));

  beforeEach(() => {
    vi.clearAllMocks();
    cursor.skip.mockReturnValue(cursor);
    cursor.limit.mockReturnValue(cursor);
    cursor.project.mockReturnValue(cursor);
    cursor.toArray.mockResolvedValue([{ id: "880RR", name: "Marmot Ajax Tent" }]);
    collection.countDocuments.mockResolvedValue(1);
    collection.find.mockReturnValue(cursor);
  });

  it("returns case-insensitive matches across product fields", async () => {
    const response = await fetch(`${baseUrl}?q=Ajax`);
    const result = await response.json();

    expect(response.status).toBe(200);
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
    await fetch(`${baseUrl}?category=tents&q=three%20season`);

    expect(collection.find).toHaveBeenCalledWith(
      expect.objectContaining({ category: "tents", $or: expect.any(Array) }),
    );
  });

  it("treats regular-expression characters as literal search text", async () => {
    await fetch(`${baseUrl}?q=tent.*`);

    expect(collection.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          { name: { $regex: "tent\\.\\*", $options: "i" } },
        ]),
      }),
    );
  });

  it("applies pagination and field selection while preserving search parameters", async () => {
    collection.countDocuments.mockResolvedValue(25);

    const response = await fetch(`${baseUrl}?q=tent&limit=10&offset=10&fields=id,name`);
    const result = await response.json();

    expect(cursor.skip).toHaveBeenCalledWith(10);
    expect(cursor.limit).toHaveBeenCalledWith(10);
    expect(cursor.project).toHaveBeenCalledWith({ id: 1, name: 1 });
    expect(result).toMatchObject({ count: 25 });
    expect(result.prev).toContain("q=tent");
    expect(result.next).toContain("offset=20");
  });

  it("returns a successful empty result when no products match", async () => {
    collection.countDocuments.mockResolvedValue(0);
    cursor.toArray.mockResolvedValue([]);

    const response = await fetch(`${baseUrl}?q=does-not-exist`);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toMatchObject({ count: 0, results: [] });
  });
});
