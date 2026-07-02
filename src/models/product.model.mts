import type { Collection, Filter, WithId } from "mongodb";
import mongodb from "../database/index.mts";
import type { Product, FindProductObj } from "./types.mts";

const baseURL = process.env.PUBLIC_SERVER_URL || "";

export async function getAllProducts(): Promise<WithId<Product>[]>;
export async function getAllProducts(find: FindProductObj): Promise<{ results: WithId<Product>[]; totalCount: number }>;
export async function getAllProducts(find?: FindProductObj) {
    const productsCollection: Collection<Product> = mongodb
        .getDb()
        .collection<Product>("products");
    const search = (find?.search || {}) as Filter<Product>;

    if (!find) {
        return productsCollection.find(search).toArray();
    }

    const totalCount = await productsCollection.countDocuments(search);

    const cursor = productsCollection
        .find(search)
        .skip(find.offset)
        .limit(find.limit);

    if (find.fieldFilters) {
        cursor.project(find.fieldFilters);
    }

    const results = await cursor.toArray();

    return { results, totalCount };
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = await mongodb
        .getDb()
        .collection<Product>("products")
        .findOne({ id });

    return product;
}

export async function findProductById(id: string) {
    const response = await fetch(baseURL + `products/${id}`);
    const product = (await response.json()) as Product;

    return product;
}

export default {
    getAllProducts,
    getProductById,
    findProductById,
};