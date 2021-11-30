const express = require("express");
const app = require("../app.js");
const catsRouter = require("./cats.router.js");
const reviewRouter = require("./review.router.js");

const apiRouter = express.Router();

apiRouter.use("/categories", catsRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
