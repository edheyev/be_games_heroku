const express = require("express");
const catsRouter = require("./cats.router.js");

const apiRouter = express.Router();

apiRouter.use("/categories", catsRouter);

module.exports = apiRouter;
