const { selectCats } = require("../models/cats.model");

exports.getCats = (req, res) => {
  console.log("controller");
  selectCats().then((cats) => {
    res.status(200).send({ categories: cats });
  });
};
