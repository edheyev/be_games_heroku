const { readApiJson } = require("../models/api.model");
exports.getEndpoints = async (req, res, next) => {
  readApiJson()
    .then((response) => {
      res.status(200).send({ apiDocument: response });
    })
    .catch(next);
};
