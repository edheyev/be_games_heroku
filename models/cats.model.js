const db = require("../db/connection");

exports.selectCats = () => {
  return db.query("SELECT * FROM categories").then((results) => {
    return results.rows;
  });
};

exports.insertCats = (newCat) => {
  const { slug, description } = newCat;
  return db
    .query(
      `INSERT into categories (slug, description)
  VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows;
    });
};
