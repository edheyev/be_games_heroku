const { selectCats, insertCats } = require("../models/cats.model");
const { checkValidBody } = require("../utils/utils");

exports.getCats = (req, res) => {
  selectCats().then((cats) => {
    res.status(200).send({ categories: cats });
  });
};

exports.postCat = (req, res, next) => {
  const newCat = req.body;
  checkValidBody(newCat, { slug: "", description: "" })
    .then(() => {
      insertCats(newCat).then(([category]) => {
        console.log(category);
        res.status(200).send({ category: category });
      });
    })
    .catch(next);
};
