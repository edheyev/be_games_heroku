const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT username FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserById = (user_id) => {
  return db
    .query(
      `SELECT * FROM users
  WHERE username = $1`,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkUserExists = (user_id) => {
  return db
    .query(
      `SELECT * FROM users
  WHERE username = $1`,
      [user_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
    });
};
