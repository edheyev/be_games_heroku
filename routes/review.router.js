const express = require("express");
const {
  getReviews,
  getReviewById,
  patchReviewVotesById,
  getReviewCommentsById,
  postCommentOnReview,
} = require("../controllers/review.controller");

const reviewRouter = express.Router();

reviewRouter.route("/").get(getReviews);

reviewRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById);

reviewRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postCommentOnReview);

module.exports = reviewRouter;
