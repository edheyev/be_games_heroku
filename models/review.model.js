const { getCats } = require("../controllers/cats.controller");
const db = require("../db/connection");
const { removeApostrophe } = require("../utils/utils");
const { selectCats } = require("./cats.model");

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
    });
};

exports.checkIfReviewExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review id not found" });
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
    });
};

exports.selectReviews = (
  sort_by = "created_at",
  order = "ASC",
  category = "",
  limit = 10,
  p = 1
) => {
  let page;
  let totalCount;
  let catQuery;
  category === ""
    ? (catQuery = "")
    : (catQuery = `WHERE category = '${removeApostrophe(category)}'`);

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

  // if (
  //   ![
  //     "",
  //     "children's-games",
  //     "euro-game",
  //     "dexterity",
  //     "social-deduction",
  //   ].includes(category)
  // ) {
  //   return Promise.reject({ status: 400, msg: "INVALID category QUERY" });
  // }

  if (!typeof limit === "number" || !typeof p === "number") {
    return Promise.reject({ status: 400, msg: "INVALID limit/page QUERY" });
  } else {
    page = limit * (p - 1);
  }

  return db
    .query(
      `SELECT * FROM reviews
   ${catQuery}`
    )
    .then(({ rows }) => {
      if (page > rows.length) {
        return Promise.reject({ status: 404, msg: "page not found" });
      }
      totalCount = rows.length;
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
        ORDER BY ${sort_by} ${order}
        LIMIT ${limit}
        OFFSET ${page};`
        )
        .then(({ rows }) => {
          rows.totalCount = totalCount;

          return rows;
        });
    });
};

exports.checkReviewCategoryExists = (category = "") => {
  let catQuery;
  category === ""
    ? (catQuery = "")
    : (catQuery = `WHERE category = '${removeApostrophe(category)}'`);

  getCats().then((categoryList) => {
    const catAr = categoryList.map((cat) => {
      return cat.slug;
    });
    if (!catAr.includes(category)) {
      return Promise.reject({ status: 400, msg: "INVALID category QUERY !" });
    } else {
      return db.query(`SELECT * FROM reviews ${catQuery}`).then((result) => {
        const { rows } = result;
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "No reviews Found" });
        } else {
          return Promise.resolve();
        }
      });
    }
  });
};

exports.checkReviewExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No reviews Found" });
      }
    });
};

exports.insertNewReview = (review_data) => {
  const { owner, title, review_body, designer, category } = review_data;
  return (
    db
      .query(
        `INSERT into reviews (owner, title, review_body, designer, category)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [owner, title, review_body, designer, category]
      )
      // .then(({ rows }) => {
      //   console.log(rows[0].review_id);
      //   return db
      //     .query(
      //       `SELECT reviews.owner, reviews.title,
      //     reviews.review_id, reviews.category,
      //     reviews.designer, reviews.created_at,
      //     reviews.votes,
      //     COUNT(comments.review_id) as comment_count
      //     FROM comments
      //     RIGHT JOIN reviews ON reviews.review_id=comments.review_id
      //     WHERE comments.review_id = ${rows[0].review_id}
      //     GROUP BY reviews.review_id`
      //     )
      .then(({ rows }) => {
        return rows[0];
      })
  );
  // });
};

exports.removeReviewById = (review_id) => {
  return db
    .query(`DELETE FROM reviews WHERE review_id = $1`, [review_id])
    .then(() => {
      console.log("hellow");

      return Promise.resolve;
    });
};
