const fs = require("fs");

exports.readApiJson = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./endpoints.json", (err, data) => {
      if (err) {
        reject(err);
      } else {
        let endpoints = JSON.parse(data);
        resolve(endpoints);
      }
    });
  });
};
