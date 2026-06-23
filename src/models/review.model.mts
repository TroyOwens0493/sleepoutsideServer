import mongodb from "../database/index.mts";
import type { ProductReview } from "./types.mts";

async function getReviewsByProductId(productId: string) {
  return mongodb
    .getDb()
    .collection<ProductReview>("reviews")
    .find({ productId })
    .toArray();
}

async function createReview(review: ProductReview) {
  return mongodb
    .getDb()
    .collection<ProductReview>("reviews")
    .insertOne(review);
}

export default {
  getReviewsByProductId,
  createReview,
};