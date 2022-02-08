exports.handleCustomErrors = (err, req, res, next) => {
  // console.log("hi there", err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handleSqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(404).send({ msg: "Invalid Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Search parameter does not exist" });
  } else if (err.code === "42703") {
    res.status(404).send({ msg: "Bad query" });
  } else {
    next(err);
  }
};
exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!!!" });
};
