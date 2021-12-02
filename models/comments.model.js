const db = require("../db/connection");

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
    });
};

exports.selectReviewCommentsById = (review_id, limit = 10, p = 1) => {
  let totalCount, page;
  if (!typeof limit === "number" || !typeof p === "number") {
    return Promise.reject({ status: 400, msg: "INVALID limit/page QUERY" });
  } else {
    page = limit * (p - 1);
  }

  return db
    .query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (page > rows.length) {
        return Promise.reject({ status: 404, msg: "page not found" });
      }
      totalCount = rows.length;
      return db
        .query(
          `SELECT comment_id, votes, 
        created_at, author, body
        FROM comments WHERE review_id = $1
        LIMIT ${limit}
        OFFSET ${page};`,
          [review_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(() => {
      return Promise.resolve;
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Comment does not exist" });
      }
      return Promise.resolve;
    });
};

exports.updateCommentVotes = (comment_id, votes) => {
  const { inc_votes } = votes;
  return db
    .query("SELECT votes FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rows }) => {
      return rows[0].votes;
    })
    .then((votes) => {
      return db
        .query(
          `UPDATE comments
      SET votes = $2
      WHERE comment_id = $1
      RETURNING *`,
          [comment_id, (votes += inc_votes)]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};
