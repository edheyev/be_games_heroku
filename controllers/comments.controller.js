const { checkReviewExists } = require("../models/review.model.js");
const {
  selectReviewCommentsById,
  insertCommentOnReview,
  removeCommentById,
  checkCommentExists,
  updateCommentVotes,
} = require("../models/comments.model");

const { checkValidBody } = require("../utils/utils");

exports.getReviewCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  const { limit, p } = req.query;
  Promise.all([
    selectReviewCommentsById(review_id, limit, p),
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      removeCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const inc_votes = req.body;
  Promise.all([
    checkCommentExists(comment_id),
    checkValidBody(inc_votes, { inc_votes: 1 }),
  ])
    .then(() => {
      updateCommentVotes(comment_id, inc_votes).then((comment) => {
        res.status(200).send({ comment: comment });
      });
    })
    .catch(next);
};
