import productModel from "../models/product.model.mts";
import type { QueryParams, FindProductObj } from "../models/types.mts";
import { formatFields } from "./utils.mts";

const getAllProducts = async (query: QueryParams) => {
    const findProduct: FindProductObj = {
        search: {},
        limit: query.limit ? parseInt(query.limit) : 20,
        offset: query.offset ? parseInt(query.offset) : 0,
    };

    // Step 6: q search
    if (query.q) {
        findProduct.search = {
            name: query.q,
            descriptionHtmlSimple: query.q,
        };
    }

    if (query.category) {
        findProduct.search.category = query.category;
    }

    if (query.fields) {
        findProduct.fieldFilters = formatFields(query.fields);
    }

    return await productModel.getAllProducts(findProduct);
};

const getProductById = async (id: string) => {
    return await productModel.getProductById(id);
};

export default {
    getAllProducts,
    getProductById,
};
