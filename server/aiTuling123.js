const http = require("http");

module.exports = function (aqWord) {
  return new Promise((resolve, reject) => {
    http
      .get(
        "http://www.tuling123.com/openapi/api?key=7e0c61672f674208a85f85f7ff08855f&userid=robot&info=" +
          encodeURIComponent(aqWord),
        (res) => {
          res.on("data", (data) => {
            // {"code":100000,"text":"请问你想查询哪个城市"}
            resolve(JSON.parse("" + data).text);
          });
        }
      )
      .on("error", (e) => {
        reject(e.message);
      });
  });
};

// 调用示例
// const aiTuling123 = require("./aiTuling123.js");
// aiTuling123("今天天气").then((res) => {
//   console.log(666.909, res);
// });
