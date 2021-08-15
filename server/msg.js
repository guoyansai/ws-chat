const config = require("./config.json");

console.log(666.101, "msg");

const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
  port: config.wsPortMsg,
});

let uid = 0;
let uuser = {};
let users = {};
let msgs = []; //聊天记录

// 广播
wss.broadcast = (msg, ws = {}) => {
  console.log(666.555, msg);
  let msgArr = toObj(msg);
  if (msgArr.length === 3) {
    msgArr.push(getTime());
    msgs.push([...msgArr]);

    if (
      msgArr[1] === config.msgType.inRoom ||
      msgArr[1] === config.msgType.outRoom
    ) {
      wss.clients.forEach(function each(client) {
        client.send(toStr(msgArr));
      });
      console.log(666.77, toStr(msgArr));
      if (msgArr[1] === config.msgType.inRoom) {
        let arrUser = toObj(msgArr[2]);
        users[uid] = [...arrUser, getTime(), uid];
        ws.us.user = users[uid];
      }
      msgArr = getUserList();
    }
    console.log(666.888, toStr(msgArr));
    // console.log(666.1008, `[SERVER] broadcast() ${msgArr}`);
    wss.clients.forEach(function each(client) {
      client.send(toStr(msgArr));
    });
  }
};

//建立连接后
wss.on("connection", (ws, req) => {
  uid++;
  uuser = {
    uid,
    time: getTime(),
    user: config.userTmp,
  };
  uuser.user[0] = `游客${uid}`;
  uuser.user[3] = `IP${req.connection.remoteAddress}`;
  ws.us = uuser;
  console.log(666.2001, uuser, [
    uid,
    config.msgType.sendUid,
    uuser.user[0],
    uuser.time,
  ]);
  ws.send(toStr([uid, config.msgType.sendUid, uuser.user[0], uuser.time]));

  ws.on("message", (msg) => {
    console.log(666.1001, `[SERVER] message msg=${msg}`, "" + msg);
    wss.broadcast("" + msg, ws);
  });

  ws.on("close", (o) => {
    try {
      delete users[ws.us.uid];
      console.log(666.1009, `[SERVER] close uid=${ws.us.uid}`, o);
      wss.broadcast([uid, config.msgType.outRoom, ws.us.user]);
    } catch (e) {
      console.log(666.1009, e);
    }
  });
});

function toObj(val) {
  if (typeof val === "string") {
    // const fVal = val.replace(/\//g, "");
    return JSON.parse(val);
  }
  return val;
}
function toStr(val) {
  if (typeof val === "object") {
    return JSON.stringify(val);
  }
  return val;
}
function getUserList() {
  return [0, config.msgType.user, toStr({ ...users }), getTime()];
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
