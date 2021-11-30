const db = require("../db/connection");

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) as comment_count 
      FROM comments 
      RIGHT JOIN reviews ON reviews.review_id=comments.review_id 
      WHERE reviews.review_id = $1 
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      //console.log(err);
    });
};

exports.checkIfReviewExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review id not found" });
      } else {
        return Promise.resolve();
      }
    });
};

exports.updateReviewVotesById = (review_id, voteInc) => {
  return db
    .query("SELECT votes FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      return rows[0].votes;
    })
    .then((votes) => {
      return db
        .query(
          `UPDATE reviews
      SET votes = $2
      WHERE review_id = $1
      RETURNING *`,
          [review_id, (votes += voteInc)]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    })
    .catch((err) => {
      // console.log(err);
    });
};

exports.selectReviews = (
  sort_by = "created_at",
  order = "ASC",
  category = ""
) => {
  let catQuery;
  category === ""
    ? (catQuery = "")
    : (catQuery = `WHERE category = '${category}'`);

  if (
    ![
      "owner",
      "title",
      "review_id",
      "category",
      "review_img_url",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "INVALID sort_by QUERY" });
  }

  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "INVALID order QUERY" });
  }

  if (
    ![
      "",
      "children's games",
      "euro game",
      "dexterity",
      "social deduction",
    ].includes(category)
  ) {
    return Promise.reject({ status: 400, msg: "INVALID category QUERY" });
  }

  return db
    .query(
      `SELECT reviews.owner, reviews.title, 
      reviews.review_id, reviews.category, 
      reviews.review_img_url, reviews.created_at,
      reviews.votes, 
      COUNT(comments.review_id) as comment_count 
      FROM comments 
      RIGHT JOIN reviews ON reviews.review_id=comments.review_id 
      ${catQuery}    
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order};`
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.checkReviewsExist = (category = "") => {
  let tCat;
  if (category.includes("'")) {
    tCat = removeApostrophe(category);
  } else {
    tCat = category;
  }
  let catQuery;
  category === "" ? (catQuery = "") : (catQuery = `WHERE category = '${tCat}'`);
  if (
    ![
      "",
      "children's games",
      "euro game",
      "dexterity",
      "social deduction",
    ].includes(category)
  ) {
    return Promise.reject({ status: 400, msg: "INVALID category QUERY" });
  }
  // console.log(catQuery);

  return db.query(`SELECT * FROM reviews ${catQuery}`).then((result) => {
    const { rows } = result;
    // console.log(result);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "category has no reviews" });
    } else {
      return Promise.resolve();
    }
  });
};
