const config = require("../client/config.js");
const aiQingyunke = require("./aiQingyunke.js");
const aiOwnthink = require("./aiOwnthink.js");

const fs = require("fs");
const WebSocket = require("ws");
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({
  port: config.wsPortMsg,
});
const saveMsg = {
  total: 100,
  fileName: "",
  tmp: {
    total: 100,
    fileName: "data/asai.txt",
  },
};
const nameList = [
  "张伟",
  "王伟",
  "王芳",
  "李伟",
  "王秀英",
  "李秀英",
  "李娜",
  "张秀英",
  "刘伟",
  "张敏",
  "李静",
  "张丽",
  "王静",
  "王丽",
  "李强",
  "张静",
  "李敏",
  "王敏",
  "王磊",
  "李军",
  "刘洋",
  "王勇",
  "张勇",
  "王艳",
  "李杰",
  "张磊",
  "王强",
  "王军",
  "张杰",
  "李娟",
  "张艳",
  "张涛",
  "王涛",
  "李明",
  "李艳",
  "王超",
  "李勇",
  "王娟",
  "刘杰",
  "王秀兰",
  "李霞",
  "刘敏",
  "张军",
  "李丽",
  "张强",
  "王平",
  "王刚",
  "王杰",
  "李桂英",
  "刘芳",
];
let users = {
  1: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    1,
  ],
  2: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    2,
  ],
  3: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    3,
  ],
  4: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    4,
  ],
  5: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    5,
  ],
  6: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    6,
  ],
  7: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    7,
  ],
  8: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    8,
  ],
  9: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    9,
  ],
  10: [
    nameList[parseInt(Math.random() * 50)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    10,
  ],
};
const aiCount = Object.keys(users).length;
const aiSleep = 50; // 多少人在线的时候AI睡觉
let uid = aiCount;
let uuser = {};

// 广播
wss.broadcast = (msg, ws = {}) => {
  let msgArr = toObj(msg);
  if (msgArr.length === 4) {
    msgArr.push(getTime());

    if (msgArr[1] === config.msgType.wsInRoom) {
      let arrUser = toObj(msgArr[2]);
      users[uid] = [...arrUser, getTime(), uid];
      ws.us.user = users[uid];
      doBroadcast(getUserList());
      fetchMsg(ws);
      msgArr[1] = config.msgType.broadInRoom;
    } else if (msgArr[1] === config.msgType.wsOutRoom) {
      msgArr[1] = config.msgType.broadOutRoom;
      doBroadcast(msgArr);
      msgArr = getUserList();
    } else if (msgArr[1] === config.msgType.wsChangeUser) {
      let oldUser = users[msgArr[0]];
      let arrUser = toObj(msgArr[2]);
      let cStr = "";
      arrUser.forEach((item, index) => {
        if (oldUser[index] !== item) {
          cStr += `${config.userTmpDes[index]}（${oldUser[index]} 变更为 ${item}）`;
        }
      });
      if (cStr) {
        msgArr = [
          msgArr[0],
          config.msgType.broadChangeUser,
          cStr,
          0,
          getTime(),
        ];
        doBroadcast(msgArr);
        users[msgArr[0]] = [...arrUser, getTime(), msgArr[0]];
        ws.us.user = users[msgArr[0]];
        msgArr = getUserList();
      } else {
        msgArr = [];
      }
    } else if (
      (msgArr[1] === config.msgType.broadMsg &&
        Object.keys(users).length < aiCount + aiSleep &&
        msgArr[3] === 0) ||
      (msgArr[3] <= aiCount && msgArr[3] !== 0)
    ) {
      let aiApi;
      let aiId = msgArr[3];
      !aiId && (aiId = parseInt(Math.random() * aiCount + 1));
      if (aiId % 2 === 0) {
        aiApi = aiOwnthink(msgArr[2]);
      } else {
        aiApi = aiQingyunke(msgArr[2]);
      }
      aiApi.then((res) => {
        const aiRe = [
          aiId,
          config.msgType.broadMsgAi,
          res,
          msgArr[0],
          getTime(),
        ];
        doBroadcast(aiRe);
      });
    }
    doBroadcast(msgArr);
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
  uuser.user[3] = `${req.connection.remoteAddress}`;
  ws.us = uuser;
  ws.send(toStr([uid, config.msgType.myUid, uuser.user, 0, uuser.time]));

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
      wss.broadcast([ws.us.uid, config.msgType.wsOutRoom, ws.us.user, 0]);
    } catch (e) {
      console.log(666.909, e);
    }
  });
});

function toObj(val) {
  if (typeof val === "string") {
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
  return [0, config.msgType.broadUser, toStr({ ...users }), 0, getTime()];
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

function doBroadcast(msgArr) {
  if (msgArr.length === 5) {
    if (msgArr[3] === 2 && msgArr[2] === "clear") {
      saveMsg.fileName = saveMsg.tmp.fileName.replace(
        "asai.txt",
        msgArr[4] + ".txt"
      );
      saveCurFileName();
    } else {
      if (
        msgArr[1] === config.msgType.broadInRoom ||
        msgArr[1] === config.msgType.broadOutRoom
      ) {
        // 不发送进出聊天室广播
      } else {
        saveMsgs(msgArr);
        wss.clients.forEach(function each(client) {
          client.send(toStr(msgArr));
        });
      }
    }
  }
}
function saveMsgs(msgArr) {
  if (msgArr[1] !== config.msgType.broadUser) {
    saveMsg.total--;
    if (saveMsg.total < 1) {
      saveMsg.total = saveMsg.tmp.total;
      saveMsg.fileName = saveMsg.tmp.fileName.replace(
        "asai.txt",
        msgArr[4] + ".txt"
      );
      saveCurFileName();
    } else if (!saveMsg.fileName) {
      try {
        saveMsg.fileName = fs.readFileSync(saveMsg.tmp.fileName, "utf-8");
      } catch (err) {
        saveMsg.fileName = saveMsg.tmp.fileName.replace(
          "asai.txt",
          msgArr[4] + ".txt"
        );
        saveCurFileName();
      }
    }
    fs.appendFile(saveMsg.fileName, toStr(msgArr) + ",", (err, data) => {
      if (err) throw err;
    });
  }
}

function saveCurFileName() {
  fs.writeFile(saveMsg.tmp.fileName, saveMsg.fileName, (err, data) => {
    if (err) throw err;
  });
}

function fetchMsg(ws) {
  if (saveMsg.fileName) {
    try {
      const msgData = fs.readFileSync(saveMsg.fileName, "utf-8");
      if (msgData) {
        if (msgData.length > 0) {
          ws.send(
            toStr([
              ws.us.uid,
              config.msgType.broadMsgFetch,
              `[${msgData}]`,
              0,
              getTime(),
            ])
          );
        }
      }
    } catch (err) {
      console.log(666.909, err);
    }
  }
}
