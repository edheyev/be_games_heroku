const {
  selectReviewById,
  checkIfReviewExists,
  updateReviewVotesById,
  selectReviews,
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
  // console.log(req.body, "<<<<<<<<<<<");
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
  selectReviews(sort_by, order, category).then((reviews) => {
    // console.log({ reviews });
    res.status(200).send({ reviews: reviews });
  });
};