const config = require("./config.json");

console.log(666.101, "msg");

const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
  port: config.wsPortMsg,
});

let uid = 0;

// 广播
wss.broadcast = function broadcast(msg) {
  let msgArr = JSON.parse(msg || []) || [];
  if (msgArr.length > 1) {
    msgArr.push(getTime());
    console.log(666.1009, `[SERVER] broadcast() ${msgArr}`);
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(msgArr));
    });
  }
};

//建立连接后
wss.on("connection", function (ws, req) {
  console.log(
    666.1001,
    `[SERVER] connection() uid=${uid} ip=${req.connection.remoteAddress}`
  );
  uid++;
  ws.send(uid);
  ws.on("message", function (msg) {
    wss.broadcast(msg);
  });
});

//获取时间
function getTime() {
  const date = new Date();
  return (
    date.getFullYear() +
    (date.getMonth() + 1 + "").padStart(2, "0") +
    (date.getDate() + "").padStart(2, "0") +
    (date.getHours() + "").padStart(2, "0") +
    (date.getMinutes() + "").padStart(2, "0") +
    (date.getSeconds() + "").padStart(2, "0")
  );
}
