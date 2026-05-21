import productModel from "../models/product.model.mts";
import type { QueryParams, FindProductObj } from "../models/types.mts";

const getAllProducts = async (query: QueryParams) => {
  const findProduct: FindProductObj = {
    search: {},
    limit: query.limit ? parseInt(query.limit) : 20,
    offset: query.offset ? parseInt(query.offset) : 0,
  };

  return await productModel.getAllProducts(findProduct);
};

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};

export default {
  getAllProducts,
  getProductById,
};
