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
  chatShow("" + msg.data);
};

document.getElementById("xx").onkeydown = function (e) {
  if (e.key === "Enter") {
    msgSendSubmit();
  }
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
  xx.value = "";
  xx.focus();
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

function chatShow(msg) {
  initDataMsg();
  if (msg && dataObj.strMsg !== msg) {
    const msgArr = toObj(msg);
    if (msgArr.length === 4) {
      if (msgArr[1] === config.msgType.broadUser) {
        this.userToDom(msgArr);
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
        this.msgToDom(msgArr);
      }
    }
  }
}

function userToDom(msgArr) {
  dataObj.arrUserList = toObj("" + msgArr[2]);
  let strUserList = "";
  let userCount = 0;
  Object.keys(dataObj.arrUserList).forEach((index) => {
    userCount++;
    const userInfo = dataObj.arrUserList[index];
    strUserList += `<div class=user>
    <div class=umz>名字：${userInfo[0]}</div>
    <div class=utx>头像：${userInfo[1]}</div>
    <div class=usr>生日：${userInfo[2]}</div>
    <div class=ucs>城市：${userInfo[3]}</div>
    <div class=uwb>尾巴：${userInfo[4]}</div>
    <div class=usj>时间：${userInfo[5]}</div>
    <div class=uid>ID：${userInfo[6]}</div>
    </div>`;
  });
  $usercount.innerHTML = userCount;
  $user.innerHTML = strUserList;
}

function msgToDom(msgArr) {
  const msgObj = {
    myid: dataObj.arrUid[0],
    uid: msgArr[0],
    umz: dataObj.arrUserList[msgArr[0]][0],
    clx: msgArr[1],
    cxx: msgArr[2],
    csj: msgArr[3],
  };
  const domMsgArea = document.createElement("div");
  if (msgObj.uid === msgObj.myid) {
    domMsgArea.style.textAlign = "right";
  }
  if (msgObj.clx === config.msgType.broadInRoom) {
    msgObj.umz = `${msgObj.cxx[0]}`;
    msgObj.cxx = `【进入房间】`;
  } else if (msgObj.clx === config.msgType.broadOutRoom) {
    msgObj.umz = `${msgObj.cxx[0]}`;
    msgObj.cxx = `【离开房间】`;
  } else if (msgObj.clx === config.msgType.broadChangeUser) {
    msgObj.cxx = `【更改名字】${msgObj.cxx}`;
  }
  const msgHtml = `<div class=msg>
  <div class=umz>名字：${msgObj.umz}</div>
  <div class=cxx>信息：${msgObj.cxx}</div>
  <div class=csj>时间：${msgObj.csj}</div>
  <div class=clx>类型：${msgObj.clx}</div>
  </div>`;
  domMsgArea.innerHTML = msgHtml;
  $msg.appendChild(domMsgArea);
  $msg.scrollTop = $msg.scrollHeight;
}
function msgTool() {
  if ($msgformtool.style.display === "block") {
    $msgformtool.style.display = "none";
    $msgformsaytool.className = "";
  } else {
    $msgformtool.style.display = "block";
    $msgformsaytool.className = "astbg";
  }
}
function menuClick(index) {
  $menu.children[0].className === "curmenu" &&
    ($menu.children[0].className = "");
  $menu.children[1].className === "curmenu" &&
    ($menu.children[1].className = "");
  $menu.children[2].className === "curmenu" &&
    ($menu.children[2].className = "");
  $user.style.display !== "none" && ($user.style.display = "none");
  $userform.style.display !== "none" && ($userform.style.display = "none");
  $msg.style.display !== "none" && ($msg.style.display = "none");
  $msgform.style.display !== "none" && ($msgform.style.display = "none");
  $menu.children[index].className = "curmenu";
  if (index === 2) {
    $userform.style.display = "block";
  } else if (index === 1) {
    $user.style.display = "block";
  } else {
    $msg.style.display = "block";
    $msgform.style.display = "flex";
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
