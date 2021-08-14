const ws = new WebSocket(config.wsIp + config.wsPortMsg);
const dataLocal = {};

const epVal = "-";
const dataUserKey = "user";
const dataMsgKey = "msg";
const dataObj = {
  arrUid: [],
  arrUser: [],
  strUser: "",
  arrMsg: [],
  strMsg: "",
};
initDataUser();
initFormUser();

ws.onmessage = function (msg) {
  console.log(666.102, msg.data, msg);
  msgShow(msg.data);
};

function msgSendSubmit() {
  msgSend([dataObj.arrUid[0], 0, xx.value]);
}
function msgSend(msg) {
  ws.send(toStr(msg));
}
function initDataUser() {
  dataObj.strUser =
    localStorage.getItem(dataUserKey) ||
    `[${epVal},0,${epVal},${epVal},${epVal}]`;
  dataObj.arrUser = toObj(dataObj.strUser);
}

function initFormUser() {
  mz.value = dataObj.arrUser[0];
  tx.value = dataObj.arrUser[1];
  sr.value = dataObj.arrUser[2];
  cs.value = dataObj.arrUser[3];
  wb.value = dataObj.arrUser[4];
}
function initDataMsg() {
  dataObj.strMsg =
    localStorage.getItem(dataMsgKey) || `[0,0,${epVal},${epVal}]`;
  dataObj.arrMsg = toObj(dataObj.strMsg);
}
function msgShow(msg) {
  initDataMsg();
  if (msg && dataObj.strMsg !== msg) {
    console.log(666.303, msg);
    const msgArr = toObj(msg);
    if (msgArr.length === 4) {
      dataObj.strMsg = msg;
      localStorage.setItem(dataMsgKey, msg);
      const msgDom = document.getElementById("msg");
      const msgP = document.createElement("p");
      let msgStr = "";
      if (msgArr[0] === dataObj.arrUid[0]) {
        msgP.style.textAlign = "right";
      }
      // 0消息1发送uid2进入3离开
      if (msgArr[1] === 1) {
        dataObj.arrUid[0] = msgArr[0];
        dataObj.arrUid[1] = msgArr[3];
        console.log(666.123, dataObj.arrUser);
        if (!dataObj.arrUser[0]) {
          dataObj.arrUser[0] = msgArr[2];
          localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
          initDataUser();
          initFormUser();
        }
        msgSend([msgArr[0], 2, dataObj.strUser]);
      } else {
        msgStr = msg;
      }
      const msgTxt = document.createTextNode(msgStr);
      msgP.appendChild(msgTxt);
      msgDom.appendChild(msgP);
    }
  }
}

function clear() {
  localStorage.setItem(dataUserKey, "");
  localStorage.setItem(dataMsgKey, "");
}
function toObj(val) {
  const fVal = val.replace(/\//g, "");
  return JSON.parse(fVal);
}
function toStr(val) {
  return JSON.stringify(val);
}
