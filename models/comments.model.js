const db = require("../db/connection");
const { removeApostrophe } = require("../utils/utils");

exports.insertCommentOnReview = (review_id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (body, author, review_id) 
  VALUES ($1, $2, $3) RETURNING *`,
      [body, username, review_id]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

exports.selectReviewCommentsById = (review_id) => {
  return db
    .query(
      `SELECT comment_id, votes, 
  created_at, author, body
  FROM comments WHERE review_id = $1`,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {});
};
