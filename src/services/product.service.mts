import productModel from "../models/product.model.mts";
import type {QueryParams} from "../models/types.mts";

 const getAllProducts = async (query: QueryParams) => {
  return await productModel.getAllProducts();
};

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};
export default {
  getAllProducts,
  getProductById
};
