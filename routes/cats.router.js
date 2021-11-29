const express = require("express");
const { getCats } = require("../controllers/cats.controller.js");

const catsRouter = express.Router();

catsRouter.route("/").get(getCats);

module.exports = catsRouter;
