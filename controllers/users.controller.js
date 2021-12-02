const {
  selectUsers,
  selectUserById,
  checkUserExists,
} = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch(next);
};

exports.getUsersById = (req, res, next) => {
  const { user_id } = req.params;
  Promise.all([selectUserById(user_id), checkUserExists(user_id)])
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};
