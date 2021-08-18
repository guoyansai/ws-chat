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
menuClick(0);
initDataUser();
initFormUser();

ws.onmessage = function (msg) {
  msgShow("" + msg.data);
};

function userSendSubmit() {
  dataObj.arrUser[0] = mz.value;
  dataObj.arrUser[1] = tx.value;
  dataObj.arrUser[2] = sr.value;
  dataObj.arrUser[3] = cs.value;
  dataObj.arrUser[4] = wb.value;
  localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
  initDataUser();
  msgSend([dataObj.arrUid[0], config.msgType.wsChangeUser, dataObj.arrUser]);
}

function msgSendSubmit() {
  msgSend([dataObj.arrUid[0], config.msgType.broadMsg, xx.value]);
}
function msgSend(msg) {
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
    const msgArr = toObj(msg);
    if (msgArr.length === 4) {
      if (msgArr[1] === config.msgType.broadUser) {
        dataObj.arrUserList = toObj("" + msgArr[2]);
        let strUserList = "";
        let userCount = 0;
        Object.keys(dataObj.arrUserList).forEach((index) => {
          userCount++;
          const userInfo=dataObj.arrUserList[index];
          strUserList += `<div class=user><div class=umz>名字：${userInfo[0]}</div><div class=utx>头像：${userInfo[1]}</div><div class=usr>生日：${userInfo[2]}</div><div class=ucs>城市：${userInfo[3]}</div><div class=uwb>尾巴：${userInfo[4]}</div><div class=usj>时间：${userInfo[5]}</div><div class=uid>ID：${userInfo[6]}</div></div>`;
        });
        $usercount.innerHTML = userCount;
        $user.innerHTML = strUserList;
      } else if (msgArr[1] === config.msgType.myUid) {
        dataObj.arrUid[0] = msgArr[0];
        dataObj.arrUid[1] = msgArr[3];
        if (!dataObj.arrUser[0] || dataObj.arrUser[0] === config.epVal) {
          dataObj.arrUser = msgArr[2];
          localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
          initDataUser();
          initFormUser();
        }
        msgSend([msgArr[0], config.msgType.wsInRoom, dataObj.arrUser]);
      } else {
        localStorage.setItem(dataMsgKey, msg);
        dataObj.strMsg = msg;
        let myid = dataObj.arrUid[0];
        let uid = msgArr[0];
        let umz = dataObj.arrUserList[uid][0];
        let clx = msgArr[1];
        let cxx = msgArr[2];
        let csj = msgArr[3];
        const domMsgArea = document.createElement("div");
        if (uid === myid) {
          domMsgArea.style.textAlign = "right";
        }
        if (clx === config.msgType.broadInRoom) {
          umz = `${cxx[0]}`;
          cxx = `【进入房间】`;
        } else if (clx === config.msgType.broadOutRoom) {
          umz = `${cxx[0]}`;
          cxx = `【离开房间】`;
        } else if (clx === config.msgType.broadChangeUser) {
          cxx = `【更改名字】${msg}`;
          cxx = `【更改名字】${msg}`;
        }
        const msgHtml = `<div class=msg><div class=umz>名字：${umz}</div><div class=cxx>信息：${cxx}</div><div class=csj>时间：${csj}</div><div class=clx>类型：${clx}</div></div>`;
        domMsgArea.innerHTML = msgHtml;
        $msg.appendChild(domMsgArea);
      }
    }
  }
}

function menuClick(index) {
  $menu.children[0].style.fontWeight !== "normal" &&
    ($menu.children[0].style.fontWeight = "normal");
  $menu.children[1].style.fontWeight !== "normal" &&
    ($menu.children[1].style.fontWeight = "normal");
  $menu.children[2].style.fontWeight !== "normal" &&
    ($menu.children[2].style.fontWeight = "normal");
  $user.style.display !== "none" && ($user.style.display = "none");
  $userform.style.display !== "none" && ($userform.style.display = "none");
  $msg.style.display !== "none" && ($msg.style.display = "none");
  $msgform.style.display !== "none" && ($msgform.style.display = "none");
  $menu.children[index].style.fontWeight = "bold";
  if (index === 2) {
    $userform.style.display = "block";
  } else if (index === 1) {
    $user.style.display = "block";
  } else {
    $msg.style.display = "block";
    $msgform.style.display = "block";
  }
}
function localClear() {
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
