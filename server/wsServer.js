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
  "以公主的傲慢゛蔑视全世界",
  "这是为什么",
  "笨吖頭↘",
  "像个孩子一样",
  "迗zんě嫆皃cんěɡ熟心",
  "、潜在美",
  "你妻负我",
  "时光流逝而去リ",
  "- 失心少年◇",
  "这一生的小情谊",
  "为你失去一切*",
  "绅士风度",
  "ぐㄖ寸雨γμ尐囡",
  "花恋叶，叶属根",
  "墨色烟华",
  "搃有夢醒ъàn兂人",
  "爱你我已知足。",
  "Angel、葬爱",
  "那些青春蜷缩的忧伤",
  "狱友",
  "哥丶傲视群雄",
  "puple╭─╯瞳眸",
  "◇樱花巷ぴ",
  "生活的仰角",
  "鲸有多爱海@",
  "旧亼難尋",
  "§普罗旺斯的薰衣草",
  "囘眸yi笑茽ni‰",
  "孤浪娇喘",
  "我来自2002~",
  "狗与狗杂◥",
  "中毒overdose@",
  "抚平、",
  "若ㄈ此時つ",
  "４.我的错",
  "賭博、害死人",
  "妖~一样的疯女人",
  "。彩色世界/",
  "逗比孩子",
  "防腐剂",
  "千紇",
  "嗔怪旳莫妮卡",
  "喜饮山月",
  "兔大萌",
  "白矮男",
  "安分小男人⌒",
  '叫爹"',
  "姐单身照样嗨",
  "智商要欠费i",
  "山涧晴岚",
  "绝望旳摇滚",
  "一光年的爱",
  "〆﹏浮雲oо",
  "-Thieves men",
  "北船余音音绕环耳",
  "闹够了没有",
  "SEND OUT （发光）",
  "▂遠ミ距離",
  "`埋藏野心",
  "梦中吻醒",
  "游戏感情的人",
  "〥 指尖的星光",
  "你拽个毛线呀!",
  "痞子",
  "天空爱上了诺言",
  "゛偷渡↗我心′",
  "花╮开一半",
  "痘痘毁我人生!",
  "果味喵",
  "折奉",
  "我缺你么",
  "ゆ别说你爱我",
  "╮莟笑的淚",
  "箴词",
  "鹿晗，我们结婚吧。",
  "吻温",
  "违心",
  "Gone- (消失）",
  "学渣又名叫抄霸",
  "烟，●寂ガ⌒寞を",
  "淩晨⒈點ゞ",
  "Favorite.莉",
  "゛ 摩登。",
  "偷得浮生",
  "漎沬驓兲謓",
  "俄删掉了过去，从此将心封",
  "沉泊玟@",
  "小男生i",
  "〆、续写不尽的爱恋",
  "乜許,冭噯.",
  "绿袖子",
  "ぺ寂寞的小兵",
  "缺席",
  "ｄ踮脚萌妹＊￣︶￣＊",
  "云诀",
  "配角而已づ",
  "红楼梦魇",
  "采姑娘的老蘑菇",
  "胖次超人",
];
let users = {
  1: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    1,
  ],
  2: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    2,
  ],
  3: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    3,
  ],
  4: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    4,
  ],
  5: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    5,
  ],
  6: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    6,
  ],
  7: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    7,
  ],
  8: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    8,
  ],
  9: [
    nameList[parseInt(Math.random() * 90 + 1)],
    parseInt(Math.random() * 90 + 1),
    "2012-02-14",
    "-",
    "-",
    getTime(),
    9,
  ],
  10: [
    nameList[parseInt(Math.random() * 90 + 1)],
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
    saveMsgs(msgArr);
    if (
      msgArr[1] === config.msgType.broadInRoom ||
      msgArr[1] === config.msgType.broadOutRoom
    ) {
      // 不发送进出聊天室广播
    } else {
      wss.clients.forEach(function each(client) {
        client.send(toStr(msgArr));
      });
    }
  }
}
function saveMsgs(msg) {
  if (msg[1] !== config.msgType.broadUser) {
    saveMsg.total--;
    if (saveMsg.total < 1) {
      saveMsg.total = saveMsg.tmp.total;
      saveMsg.fileName = "data/" + msg[3] + ".txt";
      saveCurFileName();
    } else if (!saveMsg.fileName) {
      try {
        saveMsg.fileName = fs.readFileSync(saveMsg.tmp.fileName, "utf-8");
      } catch (err) {
        saveMsg.fileName = "data/" + msg[3] + ".txt";
        saveCurFileName();
      }
    }
    fs.appendFile(saveMsg.fileName, toStr(msg) + ",", (err, data) => {
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
