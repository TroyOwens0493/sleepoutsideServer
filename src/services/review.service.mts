import reviewModel from "../models/review.model.mts";
import type { ProductReview } from "../models/types.mts";

async function getReviews(productId: string) {
  return reviewModel.getReviewsByProductId(productId);
}

async function addReview(
  productId: string,
  reviewData: {
    name: string;
    rating: number;
    review: string;
  }
) {
  const review: ProductReview = {
    productId,
    name: reviewData.name,
    rating: reviewData.rating,
    review: reviewData.review,
    createdAt: new Date(),
  };

  return reviewModel.createReview(review);
}

export default {
  getReviews,
  addReview,
};