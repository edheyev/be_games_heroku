const express = require("express");
const {
  getReviews,
  getReviewById,
  patchReviewVotesById,
} = require("../controllers/review.controller");

const reviewRouter = express.Router();

reviewRouter.route("/").get(getReviews);

reviewRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewVotesById);

module.exports = reviewRouter;
