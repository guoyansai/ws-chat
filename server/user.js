const config = require("./config.json");

// 导入WebSocket模块:
const WebSocket = require("ws");
// 引用Server类:
const WebSocketServer = WebSocket.Server;
// 实例化:
const wss = new WebSocketServer({
  port: config.wsPortUser,
});

wss.on("connection", function (ws) {
  console.log(`[SERVER] connection()`);
  ws.on("message", function (message) {
    console.log(`[SERVER] Received: ${message}`);
    ws.send(`ECHO: ${message}`, (err) => {
      if (err) {
        console.log(`[SERVER] error: ${err}`);
      }
    });
  });
});

function getDate(val) {
  return (
    val.getFullYear() +
    (val.getMonth() + 1 + "").padStart(2, "0") +
    (val.getDate() + "").padStart(2, "0")
  );
}
