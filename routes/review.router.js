const express = require("express");
const {
  getReviews,
  getReviewById,
  patchReviewVotesById,
  postReview,
  deleteReviewById,
} = require("../controllers/review.controller");

const {
  getReviewCommentsById,
  postCommentOnReview,
} = require("../controllers/comments.controller");

const reviewRouter = express.Router();

reviewRouter.route("/").get(getReviews).post(postReview);

reviewRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById)
  .delete(deleteReviewById);

reviewRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postCommentOnReview);

module.exports = reviewRouter;
