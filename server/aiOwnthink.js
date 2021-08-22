const https = require("https");

module.exports = function (aqWord) {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://api.ownthink.com/bot?appid=31ec462d28dabf2b332ca84fc5d14dfd&userid=user&spoken=" +
          encodeURIComponent(aqWord),
        (res) => {
          res.on("data", (data) => {
            resolve(JSON.parse("" + data).data.info.text);
          });
        }
      )
      .on("error", (e) => {
        reject(e.message);
      });
  });
};

// 调用示例
// const aiOwnthink = require("./aiOwnthink.js");
// aiOwnthink("今天天气").then((res) => {
//   console.log(666.909, res);
// });
