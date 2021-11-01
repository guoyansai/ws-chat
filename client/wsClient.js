const dataObj = {
  arrUid: [],
  arrUserList: {},
  arrUser: [],
  strUser: "",
  arrMsg: [],
  strMsg: "",
  msgType: config.msgType.broadMsg,
  msgDx: 0,
  menuIndex: 0,
  newMsg: 0,
};

hiddenDom($cardarea);
menuClick(dataObj.menuIndex);
initDataUser();
initFormUser();
initFaceDom();
hiddenDom($infh);
msgSpeak(config.helloMsg[parseInt(Math.random() * config.helloMsg.length)]);

function msgSend(msg) {
  ws.send(toStr(msg));
}

function getTx(utx) {
  return `http://x.asai.cc/js/tx/${utx||0}.jpg`;
}

function userSendSubmit() {
  config.userTmpName.forEach((item, index) => {
    dataObj.arrUser[index] = document.getElementById(item).value;
  });
  localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
  initDataUser();
  msgSend([
    dataObj.arrUser[0],
    dataObj.arrUid[0],
    config.msgType.wsChangeUser,
    dataObj.arrUser,
    0,
  ]);
  menuClick(0);
}

function msgSendSubmit() {
  if (xx.value) {
    msgSend([
      dataObj.arrUser[0],
      dataObj.arrUid[0],
      dataObj.msgType,
      xx.value,
      dataObj.msgDx,
    ]);
    xx.value = "";
    xx.focus();
    msgToolClose();
  }
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
  config.userTmpName.forEach((item, index) => {
    document.getElementById(item).value = dataObj.arrUser[index];
  });
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
    if (msgArr.length === 6) {
      if (msgArr[2] === config.msgType.broadUser) {
        this.userToDom(msgArr);
      } else if (msgArr[2] === config.msgType.myUid) {
        dataObj.arrUid[0] = msgArr[1];
        dataObj.arrUid[1] = msgArr[5];
        if (!dataObj.arrUser[1] || dataObj.arrUser[1] === config.epVal) {
          dataObj.arrUser = msgArr[3];
          localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
          initDataUser();
          initFormUser();
        }
        msgSend([
          msgArr[0],
          msgArr[1],
          config.msgType.wsInRoom,
          dataObj.arrUser,
          0,
        ]);
      } else {
        localStorage.setItem(dataMsgKey, msg);
        dataObj.strMsg = msg;
        this.msgToDom(msgArr);
      }
    }
  }
}

function userToDom(msgArr) {
  dataObj.arrUserList = toObj("" + msgArr[3]);
  let strUserList = "";
  let userCount = 0;
  Object.keys(dataObj.arrUserList).forEach((index) => {
    userCount++;
    const infoUser = dataObj.arrUserList[index];
    strUserList += `<div class=userd>
    ${getUserDom(infoUser[2], infoUser[1], index)}
    </div>`;
  });
  $usercount.innerHTML = userCount + "人";
  $user.innerHTML = strUserList;
}

function cardShowUser(uid) {
  const infoUser = dataObj.arrUserList[uid];
  if (infoUser) {
    const userDom = `<div class=usercard>
  <div class=cutx><img src=${getTx(infoUser[2])}></div>
  <div class=cuid>(ID：${infoUser[7]})</div>
  <div class=cumz>${htmlToTxt(infoUser[1])}</div>
  <div class=cuqm>${htmlToTxt(infoUser[5])}</div>
  <div class=cucs>城市：${htmlToTxt(infoUser[4])}</div>
  <div class=cusr>生日：${infoUser[3]}</div>
  <div class=cusj>时间：${numToDate(infoUser[6])}</div>
  <div class=cubt><button onclick="setMsgDx(${
    infoUser[7]
  })">对Ta说</button> <button onclick="cardHidden()">关闭</button></div>
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
  dataObj.arrUser[2] = utx;
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
  const infoUser = dataObj.arrUserList[msgArr[1]];
  if (infoUser && infoUser.length) {
    const msgObj = {
      myid: dataObj.arrUid[0],
      uid: msgArr[1],
      umz: infoUser[1],
      utx: infoUser[2],
      clx: msgArr[2],
      cxx: msgArr[3],
      cdx: msgArr[4],
      csj: msgArr[5],
    };

    const domMsgArea = document.createElement("div");

    if (msgObj.clx === config.msgType.broadMsgFetch) {
      const msgFetch = toObj(msgObj.cxx);
      let msgHtml = "";
      msgFetch.forEach((ItemMsgArr) => {
        msgObj.uid = ItemMsgArr[1];
        if (dataObj.arrUserList[ItemMsgArr[1]]) {
          msgObj.umz = dataObj.arrUserList[ItemMsgArr[1]][1];
          msgObj.utx = dataObj.arrUserList[ItemMsgArr[1]][2];
        } else {
          msgObj.umz = "游客" + msgObj.uid;
          msgObj.utx = 0;
        }
        msgObj.clx = ItemMsgArr[2];
        msgObj.cxx = ItemMsgArr[3];
        msgObj.cdx = ItemMsgArr[4];
        msgObj.csj = ItemMsgArr[5];
        msgHtml += "<div>" + getMsgHtml(msgObj) + "</div>";
      });
      domMsgArea.innerHTML = msgHtml;
    } else {
      newMsgCount(0);
      msgSpeak(msgObj.cxx);
      if (msgObj.uid === msgObj.myid || msgObj.cdx === msgObj.myid) {
        setDomClass(domMsgArea, "msgmy");
      }
      domMsgArea.innerHTML = getMsgHtml(msgObj);
    }

    $msg.appendChild(domMsgArea);
    $msg.scrollTop = $msg.scrollHeight;
  }
}

function newMsgCount(type) {
  if (dataObj.menuIndex !== 0) {
    if (!type) {
      dataObj.newMsg++;
    }
    if (dataObj.newMsg > 0) {
      $saycount.innerText = dataObj.newMsg;
    }
  } else {
    if (dataObj.newMsg > 0) {
      $saycount.innerText = "";
    }
    dataObj.newMsg = 0;
  }
}
function setMsgDx(dxid) {
  dataObj.msgDx = dxid || 0;
  if (dataObj.msgDx && dataObj.arrUserList[dataObj.msgDx]) {
    $msgformdx.innerHTML =
      dataObj.arrUserList[dataObj.msgDx][1].substr(0, 3) + "..<sup>×</sup>";
  } else {
    dataObj.msgDx = 0;
    $msgformdx.innerHTML = "";
  }
  menuClick(0);
}
function getMsgHtml(msgObj) {
  if (msgObj.clx === config.msgType.broadInRoom) {
    msgObj.umz = `${msgObj.cxx[0]}`;
    msgObj.cxx = `【进入聊天室】`;
  } else if (msgObj.clx === config.msgType.broadOutRoom) {
    msgObj.umz = `${msgObj.cxx[0]}`;
    msgObj.cxx = `【离开聊天室】`;
  } else if (msgObj.clx === config.msgType.broadChangeUser) {
    msgObj.cxx = `【变更个人信息】\n${msgObj.cxx}`;
  }
  return `<div class=msgd><div class=msg>
    <div class=msgu>
    ${getUserDom(msgObj.utx, msgObj.umz, msgObj.uid)}
    </div>
    <div class=msgc>
    <div class=csj>${numToDate(msgObj.csj)}</div>
    <div class="cxx lx${msgObj.clx}">${htmlToTxt(msgObj.cxx)}</div>
    </div>
    </div></div>`;
}

function msgTool() {
  if ($msgformtool.style.display === "block") {
    msgToolClose();
  } else {
    msgToolOpen();
  }
}

function msgToolOpen() {
  $msgformtool.style.display = "block";
  $msgformsaytool.className = "astbg";
}

function msgToolClose() {
  $msgformtool.style.display = "none";
  $msgformsaytool.className = "";
}

function menuClick(index) {
  dataObj.menuIndex = index;
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
    xx.focus();
  }
  newMsgCount(1);
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
  const tmpTxt = faceToImg(tmpDom.innerHTML);
  tmpDom = null;
  return tmpTxt;
}

function faceToImg(val) {
  return val
    .replace(
      /{face:([\d]*)}/gim,
      '<img id=face$1 src="http://x.asai.cc/js/qqbq/qq$1.gif">'
    )
    .replace(/{br}/gim, "<br>");
}

function initFaceDom() {
  let faceCo = config.faceCount;
  let faceDom = "";
  while (faceCo > 0) {
    faceDom = `{face:${faceCo}}` + faceDom;
    faceCo--;
  }
  $msgformtools.innerHTML = faceToImg(faceDom);
}

function insertFace(e) {
  if (e.target.id.startsWith("face")) {
    xx.value += `{${e.target.id.replace("face", "face:")}}`;
  }
  xx.focus();
}

function numToDate(val) {
  if (val) {
    return `${val.substr(0, 4)}-${val.substr(4, 2)}-${val.substr(6, 2)} 
  ${val.substr(8, 2)}:${val.substr(10, 2)}:${val.substr(12, 2)}`;
  }
}

function msgSpeak(val) {
  try {
    let eesfstr = htmlToTxt(val);
    eesfstr = eesfstr.replace(/<\/?[^>]*>/g, "");
    eesfstr = eesfstr.replace(/[ | ]*\n/g, "\n");
    eesfstr = eesfstr.replace(/\n[\s| | ]*\r/g, "\n");
    eesfstr = eesfstr.replace(/{face:([^}]*)}/gim, "");
    if (eesfstr != "") {
      let sdom = document.createElement("video");
      sdom.style.display = "none";
      // 0为女声,1为男声,3为情感合成-度逍遥,4为情感合成-度丫丫;
      sdom.src =
        "http://tts.baidu.com/text2audio/text2audio?lan=zh&ie=UTF-8&spd=6&per=" +
        Math.floor(Math.random() * 4) +
        "&text=" +
        eesfstr;
      sdom.loop = false;
      sdom.autoplay = true;
      sdom.addEventListener(
        "ended",
        function () {
          sdom = null;
        },
        false
      );
    }
  } catch (err) {}
}

function fhOnInput(e) {
  if (+fh.value === +dataObj.arrUser[0]) {
    hiddenDom($infh);
  } else {
    showDom($infh, "inline-block");
  }
}
function infhOnClick() {
  dataObj.arrUser[0] = +fh.value || 0;
  userSendSubmit();
  hiddenDom($infh);
}
