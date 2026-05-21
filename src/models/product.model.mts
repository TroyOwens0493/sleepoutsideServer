import type { Collection } from "mongodb";
import mongodb from "../database/index.mts";
import type { Product } from "./types.mts";
import type { FindProductObj } from "./types.mts";

async function getAllProducts(query: FindProductObj): Promise<Product[] | null> {
    const productsCollection: Collection<Product> = mongodb.getDb().collection<Product>('products');
    const matchingCount = await productsCollection.countDocuments({ query });
    const data = await productsCollection.find(query).toArray();
    return data;
}
async function getProductById(id: string): Promise<Product | null> {
    const product = await mongodb
        .getDb()
        .collection<Product>("products")
        .findOne({ id: id });
    return product;
}

// don't forget to export the function
export default {
    getAllProducts,
    getProductById,
};
