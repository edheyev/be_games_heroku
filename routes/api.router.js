const express = require("express");
const app = require("../app.js");
const catsRouter = require("./cats.router.js");
const reviewRouter = require("./review.router.js");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");
const { getEndpoints } = require("../controllers/api.controller");

const apiRouter = express.Router();

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/categories", catsRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
