const config = require("../client/config.js");

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
  let msgArr = toObj(msg);
  if (msgArr.length === 3) {
    msgArr.push(getTime());
    msgs.push([...msgArr]);

    if (msgArr[1] === config.msgType.wsInRoom) {
      let arrUser = toObj(msgArr[2]);
      users[uid] = [...arrUser, getTime(), uid];
      ws.us.user = users[uid];
      wss.clients.forEach(function each(client) {
        client.send(toStr(getUserList()));
      });
      msgArr[1] = config.msgType.broadInRoom;
    } else if (msgArr[1] === config.msgType.wsOutRoom) {
      wss.clients.forEach(function each(client) {
        msgArr[1] = config.msgType.broadOutRoom;
        client.send(toStr(msgArr));
      });
      msgArr = getUserList();
    } else if (msgArr[1] === config.msgType.wsChangeUser) {
      let arrUser = toObj(msgArr[2]);
      msgArr = [
        msgArr[0],
        config.msgType.broadChangeUser,
        `${users[msgArr[0]][0]} 更名为 ${arrUser[0]}`,
        getTime(),
      ];
      wss.clients.forEach(function each(client) {
        client.send(toStr(msgArr));
      });
      users[msgArr[0]] = [...arrUser, getTime(), msgArr[0]];
      ws.us.user = users[msgArr[0]];

      msgArr = getUserList();
    }
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
  ws.send(toStr([uid, config.msgType.myUid, uuser.user, uuser.time]));

  ws.on("message", (msg) => {
    if ("" + msg === "ping") {
      ws.send("pong");
    } else {
      wss.broadcast("" + msg, ws);
    }
  });

  ws.on("close", (o) => {
    try {
      delete users[ws.us.uid];
      wss.broadcast([ws.us.uid, config.msgType.wsOutRoom, ws.us.user]);
    } catch (e) {
      console.log(666.909, e);
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
  return [0, config.msgType.broadUser, toStr({ ...users }), getTime()];
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
