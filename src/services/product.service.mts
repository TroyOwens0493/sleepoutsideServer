import productModel from "../models/product.model.mts";
import type { QueryParams, FindProductObj, Product } from "../models/types.mts";
import { buildPaginationWrapper, formatFields } from "./utils.mts";

const getAllProducts = async (query: QueryParams) => {
    const find: FindProductObj = {
        search: {},
        limit: query.limit ? parseInt(query.limit) : 20,
        offset: query.offset ? parseInt(query.offset) : 0,
    }
    const { q, category, fields } = query;

    find.fieldFilters = fields ? formatFields(fields) : undefined;
    if (category) {
        find.search.category = category as Product["category"];
    }
    const searchTerm = q?.trim();
    if (searchTerm) {
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const match = { $regex: escapedSearchTerm, $options: "i" };
        find.search.$or = [
            { name: match },
            { nameWithoutBrand: match },
            { descriptionHtmlSimple: match },
            { category: match },
        ];
    }

    const data = await productModel.getAllProducts(find);

    const wrapper = buildPaginationWrapper(data.totalCount, query)

    wrapper.results = data.results
    return wrapper
};

const getProductById = async (id: string) => {
    return await productModel.getProductById(id);
};

export default {
    getAllProducts,
    getProductById,
};
