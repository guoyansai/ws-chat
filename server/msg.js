const config = require("./config.json");

console.log(666.101, "msg");

const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
  port: config.wsPortMsg,
});

const epVal = "-";

let uid = 0;
let uuser = {};
let users = {};
let msgs = []; //聊天记录

// 广播
wss.broadcast = (msg) => {
  let msgArr = toObj(msg);
  console.log(666.555,msgArr)
  if (msgArr.length === 3) {
    msgs.push([...msgArr]);
    msgArr.push(getTime());
    if (msgArr[1] === 2) {
      let arrUser = toObj(msgArr[2]);
      users[uid] = [...arrUser, getTime()];
      msgArr = getMsgUsers();
    } else if (msgArr[1] === 3) {
    }
    console.log(666.1008, `[SERVER] broadcast() ${msgArr}`);
    wss.clients.forEach(function each(client) {
      client.send(toStr(msgArr));
    });
  }
};

//建立连接后
wss.on("connection", (ws, req) => {
  uid++;
  uid = uid;
  uuser = {
    uid,
    time: getTime(),
    user: ["游客" + uid, 0, epVal, epVal, epVal],
  };
  ws.us = uuser;
  console.log(
    666.1001,
    `[SERVER] connection() uid=${uid} ip=${req.connection.remoteAddress}`
  );
  ws.send(toStr([uid, 1, uuser.user[0], uuser.time]));

  ws.on("message", (msg) => {
    console.log(666.1001, `[SERVER] message msg=${msg}`);
    wss.broadcast(msg);
  });

  ws.on("close", (o) => {
    try {
      delete users[ws.us.uid];
      console.log(666.1009, `[SERVER] close uid=${ws.us.uid}`, o);
      wss.broadcast(toStr(getMsgUsers()));
      wss.broadcast(toStr([uid, 3, `[${ws.us.user}]`]));
    } catch (e) {
      console.log(666.1009, e);
    }
  });
});

function toObj(val) {
  // if (val && typeof val === "string") {
    // const fVal = val.replace(/\//g, "");
    return JSON.parse(val);
  // }
  return [];
}
function toStr(val) {
  return JSON.stringify(val);
}
function getMsgUsers() {
  return [0, 5, toStr(users), getTime()];
}
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
