const http = require("http");

module.exports = function (aqWord) {
  return new Promise((resolve, reject) => {
    http
      .get(
        "http://api.qingyunke.com/api.php?key=free&appid=0&msg=" +
          encodeURIComponent(aqWord),
        (res) => {
          res.on("data", (data) => {
            // {"result":0,"content":"先告诉菲菲您在哪个城市，让我帮您查天气吧"}
            resolve(JSON.parse("" + data).content);
          });
        }
      )
      .on("error", (e) => {
        reject(e.message);
      });
  });
};

// 调用示例
// const aiQingyunke = require("./aiQingyunke.js");
// aiQingyunke("今天天气").then((res) => {
//   console.log(666.909, res);
// });
