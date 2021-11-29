const db = require("../db/connection");

exports.selectCats = () => {
  console.log("model");
  return db.query("SELECT * FROM categories").then((results) => {
    return results.rows;
  });
};
