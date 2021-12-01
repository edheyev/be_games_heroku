const {
  selectReviewById,
  checkIfReviewExists,
  updateReviewVotesById,
  selectReviews,
  checkReviewCategoryExists,
  selectReviewCommentsById,
  checkReviewExists,
  insertCommentOnReview,
} = require("../models/review.model.js");
const { checkValidBody, removeApostrophe } = require("../utils/utils");

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
  const { sort_by, order, category } = req.query;
  Promise.all([
    selectReviews(sort_by, order, category),
    checkReviewCategoryExists(category),
  ])
    .then(([reviews]) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  Promise.all([
    selectReviewCommentsById(review_id),
    checkReviewExists(review_id),
  ])
    .then(([reviewComments]) => {
      res.status(200).send({ comments: reviewComments });
    })
    .catch(next);
};

exports.postCommentOnReview = (req, res, next) => {
  const { review_id } = req.params;
  const comment = req.body;

  Promise.all([
    insertCommentOnReview(review_id, comment),
    checkValidBody(comment, { username: "example", body: "example" }),
  ])
    .then(([comment]) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
