const { checkReviewExists } = require("../models/review.model.js");
const {
  selectReviewCommentsById,
  insertCommentOnReview,
} = require("../models/comments.model");

const { checkValidBody } = require("../utils/utils");

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
