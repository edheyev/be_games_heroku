const { insertCommentOnReview } = require("../models/comments.model.js");
const {
  selectReviewById,
  checkIfReviewExists,
  updateReviewVotesById,
  selectReviews,
  checkReviewCategoryExists,
  insertNewReview,
} = require("../models/review.model.js");
const { checkValidBody } = require("../utils/utils");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  Promise.all([selectReviewById(review_id), checkIfReviewExists(review_id)])
    .then(([reviews]) => res.status(200).send({ reviews: reviews }))
    .catch(next);
};
exports.patchReviewVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    updateReviewVotesById(review_id, inc_votes),
    checkIfReviewExists(review_id),
    checkValidBody(req.body, { inc_votes: 1 }),
  ])
    .then(([review]) => {
      res.status(200).send({ updatedReview: review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category, limit, p } = req.query;
  Promise.all([
    selectReviews(sort_by, order, category, limit, p),
    checkReviewCategoryExists(category),
  ])
    .then(([reviews]) => {
      res
        .status(200)
        .send({ reviews: reviews, totalCount: reviews.totalCount });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const reviewData = req.body;
  const exampleRev = {
    owner: "",
    title: "",
    review_body: "",
    designer: "",
    category: "",
  };
  checkValidBody(reviewData, exampleRev).then(() => {
    insertNewReview(reviewData).then((review) => {
      res.status(200).send({ review: review });
    });
  });
  // .catch(err);
};
