const express = require("express");
const apiRouter = require("./routes/api.router");

const app = express();
app.use(express.json());
console.log("api");
app.use("/api", apiRouter);

module.exports = app;
