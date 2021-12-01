const { readApiJson } = require("../models/api.model");
exports.getEndpoints = async (req, res, next) => {
  readApiJson()
    .then((response) => {
      console.log({ apiDocument: response });
      res.status(200).send({ apiDocument: response });
    })
    .catch(next);
};
