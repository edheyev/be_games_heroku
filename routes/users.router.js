const express = require("express");
const { getUsers, getUsersById } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:user_id").get(getUsersById);

module.exports = usersRouter;
