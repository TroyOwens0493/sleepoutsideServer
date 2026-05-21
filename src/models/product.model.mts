import type { Collection } from "mongodb";
import mongodb from "../database/index.mts";
import type { Product } from "./types.mts";
import type { FindProductObj } from "./types.mts";

async function getAllProducts(query: FindProductObj): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    data: Product[],
}> {
    const productsCollection: Collection<Product> = mongodb.getDb().collection<Product>('products');
    const matchingCount = await productsCollection.countDocuments({ query });
    const res = productsCollection.find({ query });
    const data = res.project(query.fieldFilters);
    const dataArray = await data.toArray();
    return {
        count: matchingCount,
        data: dataArray,
    };
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
