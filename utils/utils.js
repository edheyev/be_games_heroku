exports.checkValidBody = (check, example) => {
  return new Promise((resolve, reject) => {
    const cKeys = Object.keys(check).sort();
    const eKeys = Object.keys(example).sort();
    if (JSON.stringify(cKeys) !== JSON.stringify(eKeys)) {
      const errorObj = {
        status: 404,
        msg: "bad patch request- keys dont match",
      };
      reject(errorObj);
    } else {
      //loop through key value pairs and make sure all same type
      for (const [key, value] of Object.entries(check)) {
        if (typeof value !== typeof example[key]) {
          const errorObj = {
            status: 404,
            msg: "bad patch request- values are wrong type",
          };
          reject(errorObj);
        }
      }
      resolve();
    }
  });
};
