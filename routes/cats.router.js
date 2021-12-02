const express = require("express");
const { getCats, postCat } = require("../controllers/cats.controller.js");

const catsRouter = express.Router();

catsRouter.route("/").get(getCats).post(postCat);

module.exports = catsRouter;
