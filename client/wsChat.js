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

function chatShow(msg) {
  initDataMsg();
  if (msg && dataObj.strMsg !== msg) {
    var msgArr = toObj(msg);
    if (msgArr.length === 6) {
      if (msgArr[2] === config.msgType.broadUser) {
        this.userToDom(msgArr);
      } else if (msgArr[2] === config.msgType.myUid) {
        dataObj.arrUid[0] = msgArr[1];
        dataObj.arrUid[1] = msgArr[5];
        if (!dataObj.arrUser[1] || dataObj.arrUser[1] === config.epVal) {
          dataObj.arrUser = msgArr[3];
          storageSetItem(dataUserKey, toStr(dataObj.arrUser));
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
        storageSetItem(dataMsgKey, msg);
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
  Object.keys(dataObj.arrUserList).forEach(function (index) {
    userCount++;
    var infoUser = dataObj.arrUserList[index];
    strUserList +=
      "<div class=userd>" +
      getUserDom(infoUser[2], infoUser[1], index) +
      "</div>";
  });
  $usercount.innerHTML = userCount + "人";
  $user.innerHTML = strUserList;
}

function initDataMsg() {
  dataObj.strMsg = storageGetItem(dataMsgKey);
  if (dataObj.strMsg) {
    dataObj.arrMsg = toObj(dataObj.strMsg);
  } else {
    dataObj.strMsg = toStr(config.msgTmp);
    dataObj.arrMsg = config.msgTmp;
  }
}

function msgToDom(msgArr) {
  var infoUser = dataObj.arrUserList[msgArr[1]];
  if (infoUser && infoUser.length) {
    var msgObj = {
      myid: dataObj.arrUid[0],
      uid: msgArr[1],
      umz: infoUser[1],
      utx: infoUser[2],
      clx: msgArr[2],
      cxx: msgArr[3],
      cdx: msgArr[4],
      csj: msgArr[5],
    };

    var domMsgArea = document.createElement("div");

    if (msgObj.clx === config.msgType.broadMsgFetch) {
      var msgFetch = toObj(msgObj.cxx);
      let msgHtml = "";
      msgFetch.forEach(function (ItemMsgArr) {
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

function getMsgHtml(msgObj) {
  if (msgObj.clx === config.msgType.broadInRoom) {
    msgObj.umz = msgObj.cxx[0];
    msgObj.cxx = "【进入聊天室】";
  } else if (msgObj.clx === config.msgType.broadOutRoom) {
    msgObj.umz = msgObj.cxx[0];
    msgObj.cxx = "【离开聊天室】";
  } else if (msgObj.clx === config.msgType.broadChangeUser) {
    msgObj.cxx = "【变更个人信息】\n" + msgObj.cxx;
  }
  return (
    "<div class=msgd><div class=msg><div class=msgu>" +
    getUserDom(msgObj.utx, msgObj.umz, msgObj.uid) +
    "</div><div class=msgc><div class=csj>" +
    numToDate(msgObj.csj) +
    '</div><div class="cxx lx' +
    msgObj.clx +
    '">' +
    htmlToTxt(msgObj.cxx) +
    "</div></div></div></div>"
  );
}

function fhOnInput(e) {
  if (+fh.value === +dataObj.arrUser[0]) {
    hiddenDom($infh);
  } else {
    showDom($infh, "inline-block");
  }
}

function infhClick() {
  if (fh.value) {
    dataObj.arrUser[0] = +fh.value;
    location.href = location.href.split("#")[0] + "#" + fh.value;
    userSendSubmit();
    hiddenDom($infh);
  }
}

function infhUrl(val) {
  if (val) {
    fh.value = val;
    dataObj.arrUser[0] = +fh.value;
    userSendSubmit();
    hiddenDom($infh);
  }
  this.infhClick();
}
