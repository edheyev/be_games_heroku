const db = require("../db/connection");

exports.selectCats = () => {
  return db.query("SELECT * FROM categories").then((results) => {
    return results.rows;
  });
};
