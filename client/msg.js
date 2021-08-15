const ws = new WebSocket(config.wsIp + config.wsPortMsg);
const dataLocal = {};

const dataUserKey = "user";
const dataMsgKey = "msg";
const dataObj = {
  arrUid: [],
  arrUserList: {},
  arrUser: [],
  strUser: "",
  arrMsg: [],
  strMsg: "",
};
initDataUser();
initFormUser();

ws.onmessage = function (msg) {
  // console.log(666.102, msg.data, msg);
  msgShow("" + msg.data);
};

function msgSendSubmit() {
  msgSend([dataObj.arrUid[0], config.msgType.msg, xx.value]);
}
function msgSend(msg) {
  console.log(666.10088, msg, toStr(msg));
  ws.send(toStr(msg));
}
function initDataUser() {
  dataObj.strUser = localStorage.getItem(dataUserKey);
  if (dataObj.strUser) {
    dataObj.arrUser = toObj(dataObj.strUser);
  } else {
    dataObj.strUser = toStr(config.userTmp);
    dataObj.arrUser = config.userTmp;
  }
}
function initFormUser() {
  mz.value = dataObj.arrUser[0];
  tx.value = dataObj.arrUser[1];
  sr.value = dataObj.arrUser[2];
  cs.value = dataObj.arrUser[3];
  wb.value = dataObj.arrUser[4];
}
function initDataMsg() {
  dataObj.strMsg = localStorage.getItem(dataMsgKey);
  if (dataObj.strMsg) {
    dataObj.arrMsg = toObj(dataObj.strMsg);
  } else {
    dataObj.strMsg = toStr(config.msgTmp);
    dataObj.arrMsg = config.msgTmp;
  }
}
function msgShow(msg) {
  initDataMsg();
  if (msg && dataObj.strMsg !== msg) {
    // console.log(666.303, msg);
    const msgArr = toObj(msg);
    if (msgArr.length === 4) {
      console.log(666.10021, msgArr);
      if (msgArr[1] === config.msgType.user) {
        dataObj.arrUserList = toObj("" + msgArr[2]);
        console.log(666.10022, dataObj.arrUserList);
        let strUserList = "";
        Object.keys(dataObj.arrUserList).forEach((index) => {
          strUserList += `<p>${dataObj.arrUserList[index]}</p>`;
        });
        document.getElementById("user").innerHTML = strUserList;
      } else {
        dataObj.strMsg = msg;
        localStorage.setItem(dataMsgKey, msg);
        const msgDom = document.getElementById("msg");
        const msgP = document.createElement("p");
        let msgStr = "";
        if (msgArr[0] === dataObj.arrUid[0]) {
          msgP.style.textAlign = "right";
        }
        // 0消息1发送uid2进入3离开4更新user5广播user
        if (msgArr[1] === config.msgType.sendUid) {
          dataObj.arrUid[0] = msgArr[0];
          dataObj.arrUid[1] = msgArr[3];
          if (!dataObj.arrUser[0]) {
            dataObj.arrUser = msgArr[2];
            localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
            initDataUser();
            initFormUser();
          }

          console.log(666.123, [
            msgArr[0],
            config.msgType.inRoom,
            dataObj.arrUser,
          ]);

          msgSend([msgArr[0], config.msgType.inRoom, dataObj.arrUser]);
        } else if (msgArr[1] === config.msgType.inRoom) {
          msgStr = `${dataObj.arrUserList[msgArr[0]][0]}:【进入房间】${msg}`;
        } else if (msgArr[1] === config.msgType.outRoom) {
          msgStr = `${dataObj.arrUserList[msgArr[0]][0]}:【离开房间】${msg}`;
        } else {
          msgStr = `${dataObj.arrUserList[msgArr[0]][0]}:${msgArr[2]}___
          ${msgArr[3]}`;
        }
        const msgTxt = document.createTextNode(msgStr);
        msgP.appendChild(msgTxt);
        msgDom.appendChild(msgP);
      }
    }
  }
}

function clear() {
  localStorage.setItem(dataUserKey, "");
  localStorage.setItem(dataMsgKey, "");
}
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
