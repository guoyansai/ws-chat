hiddenDom($cardarea);
menuClick(0);
initDataUser();
initFormUser();

function msgSend(msg) {
  ws.send(toStr(msg));
}

function getTx(utx) {
  return `tx/${utx}.jpg`;
}

function userSendSubmit() {
  dataObj.arrUser[0] = mz.value;
  dataObj.arrUser[1] = tx.value;
  dataObj.arrUser[2] = sr.value;
  dataObj.arrUser[3] = cs.value;
  dataObj.arrUser[4] = qm.value;
  localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
  initDataUser();
  msgSend([dataObj.arrUid[0], config.msgType.wsChangeUser, dataObj.arrUser]);
}

function msgSendSubmit() {
  msgSend([dataObj.arrUid[0], config.msgType.broadMsg, xx.value]);
  xx.value = "";
  xx.focus();
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
  qm.value = dataObj.arrUser[4];
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
    strUserList += `<div class=userd>
    ${getUserDom(userInfo[1], userInfo[0], index)}
    </div>`;
  });
  $usercount.innerHTML = userCount;
  $user.innerHTML = strUserList;
}

function cardShowUser(uid) {
  const userInfo = dataObj.arrUserList[uid];
  if (userInfo) {
    const userDom = `<div class=usercard>
  <div class=cutx><img src=${getTx(userInfo[1])}></div>
  <div class=cuid>(ID：${userInfo[6]})</div>
  <div class=cumz>${htmlToTxt(userInfo[0])}</div>
  <div class=cuqm>${htmlToTxt(userInfo[4])}</div>
  <div class=cucs>城市：${htmlToTxt(userInfo[3])}</div>
  <div class=cusr>生日：${userInfo[2]}</div>
  <div class=cusj>时间：${numToDate(userInfo[5])}</div>
  <div class=cubt><button onclick="cardHidden()">关闭</button></div>
  </div>`;
    $card.innerHTML = userDom;
    showDom($cardarea, "flex");
  }
}

function cardShowTx(utx) {
  let i = 0;
  let strDom = "";
  while (i < 95) {
    strDom += `<div class=usertx><div class="user" onclick="setTxValue(${i})">
    <div class=utx><img src=${getTx(i)}></div>
    <div class=umz>头像${i}</div>
    </div></div>`;
    i++;
  }

  $card.innerHTML = strDom;
  showDom($cardarea, "flex");
}

function setTxValue(utx) {
  dataObj.arrUser[1] = utx;
  tx.value = utx;
  userSendSubmit();
}

function getUserDom(utx, umz, uid) {
  return `<div class="user" onclick="cardShowUser(${uid})">
<div class=utx><img src=${getTx(utx)}></div>
<div class=umz>${htmlToTxt(umz)}</div>
</div>`;
}

function cardHidden() {
  $card.innerHTML = "";
  hiddenDom($cardarea);
}

function msgToDom(msgArr) {
  const userInfo = dataObj.arrUserList[msgArr[0]];
  if (userInfo.length) {
    const msgObj = {
      myid: dataObj.arrUid[0],
      uid: msgArr[0],
      umz: userInfo[0],
      utx: userInfo[1],
      clx: msgArr[1],
      cxx: msgArr[2],
      csj: msgArr[3],
    };
    const domMsgArea = document.createElement("div");
    if (msgObj.uid === msgObj.myid) {
      domMsgArea.className = "msgmy";
    }
    if (msgObj.clx === config.msgType.broadInRoom) {
      msgObj.umz = `${msgObj.cxx[0]}`;
      msgObj.cxx = `【进入房间】`;
    } else if (msgObj.clx === config.msgType.broadOutRoom) {
      msgObj.umz = `${msgObj.cxx[0]}`;
      msgObj.cxx = `【离开房间】`;
    } else if (msgObj.clx === config.msgType.broadChangeUser) {
      msgObj.cxx = `【${msgObj.cxx}】`;
    }
    const msgHtml = `<div class=msgd><div class=msg>
  <div class=msgu>
  ${getUserDom(msgObj.utx, msgObj.umz, msgObj.uid)}
  </div>
  <div class=msgc>
  <div class=csj>${numToDate(msgObj.csj)}</div>
  <div class="cxx lx${msgObj.clx}">${htmlToTxt(msgObj.cxx)}</div>
  </div>
  </div></div>`;
    domMsgArea.innerHTML = msgHtml;
    $msg.appendChild(domMsgArea);
    $msg.scrollTop = $msg.scrollHeight;
  }
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
  setDomClass($menu.children[0], "");
  setDomClass($menu.children[1], "");
  setDomClass($menu.children[2], "");
  setDomClass($menu.children[index], "curmenu");
  hiddenDom($user);
  hiddenDom($userform);
  hiddenDom($msg);
  hiddenDom($msgform);
  if (index === 2) {
    showDom($userform, "block");
  } else if (index === 1) {
    showDom($user, "block");
  } else {
    showDom($msg, "block");
    showDom($msgform, "flex");
  }
}

function setDomClass(dom, value) {
  if (dom.className !== value) {
    dom.className = value;
  }
}

function showDom(dom, value) {
  if (dom.style.display !== value) {
    dom.style.display = value;
  }
}

function hiddenDom(dom) {
  if (dom.style.display !== "none") {
    dom.style.display = "none";
  }
}

function localClear() {
  localStorage.setItem(dataUserKey, "");
  localStorage.setItem(dataMsgKey, "");
}

function toObj(val) {
  if (typeof val === "string") {
    return JSON.parse("" + val);
  }
  return val;
}

function toStr(val) {
  if (typeof val === "object") {
    return JSON.stringify(val);
  }
  return val;
}

function htmlToTxt(val) {
  let tmpDom = document.createElement("div");
  tmpDom.textContent ? (tmpDom.textContent = val) : (tmpDom.innerText = val);
  const tmpTxt = tmpDom.innerHTML;
  tmpDom = null;
  return tmpTxt;
}

function numToDate(val) {
  return `${val.substr(0, 4)}-${val.substr(4, 2)}-${val.substr(6, 2)} 
  ${val.substr(8, 2)}:${val.substr(10, 2)}:${val.substr(12, 2)}`;
}
