const db = require("../connection");
const format = require("pg-format");

const seed = function (data) {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS reviews;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories ;`);
      })
      //category
      .then(() => {
        return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR(255)
      );`);
      })
      //user
      .then(() => {
        return db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        avatar_url VARCHAR(255), 
        name VARCHAR(255)
      );`);
      })
      //review
      .then(() => {
        return db.query(`
      CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        review_body VARCHAR(2000),
        designer VARCHAR(255),
        review_img_url VARCHAR(255) DEFAULT ('https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'),
        votes INT DEFAULT (0),
        category VARCHAR(255) REFERENCES categories (slug),
        owner VARCHAR(255) REFERENCES users (username),
        created_at DATE DEFAULT (now() at time zone 'utc')
      );`);
      })
      //comment
      .then(() => {
        return db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(255) REFERENCES users (username),
        review_id INT REFERENCES reviews (review_id),
        votes INT DEFAULT (0),
        created_at DATE DEFAULT (now() at time zone 'utc'), 
        body VARCHAR(2000)
      );`);
      })
      // 2. insert data
      //category data
      .then(() => {
        const formattedCatData = categoryData.map((catDat) => {
          return [catDat.slug, catDat.description];
        });
        const queryStr = format(
          `INSERT INTO categories (slug, description) 
          VALUES %L RETURNING *;`,
          formattedCatData
        );
        return db.query(queryStr);
      })
      //user data
      .then(() => {
        const formattedUserData = userData.map((usDat) => {
          return [usDat.username, usDat.avatar_url, usDat.name];
        });
        const queryStr = format(
          `INSERT INTO users (username, avatar_url, name) 
          VALUES %L RETURNING *;`,
          formattedUserData
        );
        return db.query(queryStr);
      })
      //review data
      .then(() => {
        const formattedReviewData = reviewData.map((revDat) => {
          return [
            revDat.title,
            revDat.review_body,
            revDat.designer,
            revDat.review_img_url,
            revDat.votes,
            revDat.category,
            revDat.owner,
            revDat.created_at,
          ];
        });
        const queryStr = format(
          `INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at) 
          VALUES %L RETURNING *;`,
          formattedReviewData
        );
        return db.query(queryStr);
      })
      //comment data
      .then(() => {
        const formattedCommentData = commentData.map((comDat) => {
          return [
            comDat.author,
            comDat.review_id,
            comDat.votes,
            comDat.created_at,
            comDat.body,
          ];
        });
        const queryStr = format(
          `INSERT INTO comments ( author, review_id, votes, created_at, body) 
          VALUES %L RETURNING *;`,
          formattedCommentData
        );
        return db.query(queryStr);
      })
  );
};

module.exports = { seed };
