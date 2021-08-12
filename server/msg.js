const config = require("./config.json");

console.log(666.101, "msg");

const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
  port: config.wsPortMsg,
});

let id = 0;

wss.on("connection", function (ws) {
  console.log(`[SERVER] connection()`);
  let db = [];
  ws.on("message", function (message) {
    id++;
    let dbCur = JSON.parse(message) || [0];
    dbCur.splice(1, 0, getTime());
    db.unshift(dbCur);
    let dbStr = JSON.stringify(db);
    console.log(`[SERVER] Received: ${dbStr}`);
    ws.send(dbStr, (err) => {
      if (err) {
        console.log(`[SERVER] error: ${err}`);
      }
    });
    this.msger = setInterval(() => {
      ws.send(dbStr, (err) => {
        if (err) {
          console.log(`[SERVER] error: ${err}`);
          clearInterval(this.msger);
          this.msger = null;
        }
      });
    }, 3000);
    clearInterval(this.msger);
    this.msger = null;
  });
});

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
