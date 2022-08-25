var dataObj = {
  arrUid: [],
  arrUserList: {},
  arrUser: [],
  strUser: "",
  arrMsg: [],
  strMsg: "",
  msgType: config.msgType.broadMsg,
  msgDx: 0,
  menuIndex: 0,
};

hiddenDom($cardarea);
initDataUser();
initFormUser();
initFaceDom();
hiddenDom($infh);
menuClick(0);
decAuto(1);
msgSpeak(config.helloMsg[parseInt(Math.random() * config.helloMsg.length)]);

function msgSend(msg) {
  ws.send(toStr(msg));
}

function getTx(utx) {
  return "http://x.asai.cc/js/tx/" + utx + ".jpg";
}

function showTx(event) {
  $tximg.src = getTx(event.target.value);
}

function userSendSubmit() {
  config.userTmpName.forEach(function (item, index) {
    dataObj.arrUser[index] = document.getElementById(item).value;
  });
  storageSetItem(dataUserKey, toStr(dataObj.arrUser));
  initDataUser();
  msgSend([
    dataObj.arrUser[0],
    dataObj.arrUid[0],
    config.msgType.wsChangeUser,
    dataObj.arrUser,
    0,
  ]);
}

function storageGetItem(key) {
  if (window.localStorage) {
    return localStorage.getItem(key);
  }
  return;
}

function storageSetItem(key, value) {
  if (window.localStorage) {
    localStorage.setItem(key, value);
  }
}

function initDataUser() {
  if (window.localStorage) {
    dataObj.strUser = storageGetItem(dataUserKey);
  }
  if (dataObj.strUser) {
    dataObj.arrUser = toObj(dataObj.strUser);
  } else {
    dataObj.strUser = toStr(config.userTmp);
    dataObj.arrUser = config.userTmp;
  }
}

function initFormUser() {
  config.userTmpName.forEach(function (item, index) {
    document.getElementById(item).value = dataObj.arrUser[index];
  });
}

function cardShowUser(uid) {
  var infoUser = dataObj.arrUserList[uid];
  if (infoUser) {
    var userDom =
      "<div class=usercard><div class=cutx><img src=" +
      getTx(infoUser[2]) +
      "></div><div class=cuid>(ID：" +
      infoUser[7] +
      ")</div><div class=cumz>" +
      htmlToTxt(infoUser[1]) +
      "</div><div class=cuqm>" +
      htmlToTxt(infoUser[5]) +
      "</div><div class=cucs>城市：" +
      ip2City(infoUser[4]) +
      "</div><div class=cusr>生日：" +
      infoUser[3] +
      "</div><div class=cusj>时间：" +
      numToDate(infoUser[6]) +
      '</div><div class=cubt><button onclick="setMsgDx(' +
      infoUser[7] +
      ')">对Ta说</button> <button onclick="cardHidden()">关闭</button></div></div>';
    $card.innerHTML = userDom;
    showDom($cardarea, "flex");
  }
}

function cardShowTx(utx) {
  let i = 0;
  let strDom = "";
  while (i < 95) {
    strDom +=
      '<div class=usertx><div class="user" onclick="setTxValue(' +
      i +
      ')"><div class=utx><img src=' +
      getTx(i) +
      "></div><div class=umz>头像" +
      i +
      "</div></div></div>";
    i++;
  }

  $card.innerHTML = strDom;
  showDom($cardarea, "flex");
}

function setTxValue(utx) {
  $tximg.src = getTx(utx);
  dataObj.arrUser[2] = utx;
  tx.value = utx;
  userSendSubmit();
}

function getUserDom(utx, umz, uid) {
  return (
    '<div class="user" onclick="cardShowUser(' +
    uid +
    ')"><div class=utx><img src=' +
    getTx(utx) +
    "></div><div class=umz>" +
    htmlToTxt(umz) +
    "</div></div>"
  );
}

function cardHidden() {
  $card.innerHTML = "";
  hiddenDom($cardarea);
}

function setMsgDx(dxid) {
  dataObj.msgDx = dxid;
  if (dataObj.msgDx && dataObj.arrUserList[dataObj.msgDx]) {
    $msgformdx.innerHTML =
      dataObj.arrUserList[dataObj.msgDx][1].substr(0, 3) + "..<sup>×</sup> ";
  } else {
    dataObj.msgDx = 0;
    $msgformdx.innerHTML = "";
  }
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

function decAuto(type = 0) {
  if (type || $decarea.style.display !== "none") {
    $decarea.style.display = "none";
  } else {
    showDom($decarea, "flex");
  }
}

function menuClick(index) {
  const max = 2;
  let i = 0;
  while (i < max) {
    setDomClass(document.getElementById("menu" + i), "");
    hiddenDom(document.getElementById("main" + i));
    i++;
  }
  if (index < max) {
    dataObj.menuIndex = index;
  } else {
    dataObj.menuIndex = 0;
  }
  setDomClass(document.getElementById("menu" + dataObj.menuIndex), "curmenu");
  showDom(document.getElementById("main" + dataObj.menuIndex), "block");
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
  storageSetItem(dataUserKey, "");
  storageSetItem(dataMsgKey, "");
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
  var tmpTxt = faceToImg(tmpDom.innerHTML);
  tmpDom = null;
  return tmpTxt;
}

function ip2City(val) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      return xhr.responseText
        .replace("电信", "")
        .replace("联通", "")
        .replace("移动", "");
    }
  };
  xhr.open(
    "get",
    "http://ip.asai.cc/?ty=2&ip=" +
      htmlToTxt(val).match(/\d+/g).join("."),
    true
  );
  xhr.overrideMimeType("text/html;charset=gb2312");
  xhr.send(null);
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
    faceDom = "{face:" + faceCo + "}" + faceDom;
    faceCo--;
  }
  $msgformtools.innerHTML = faceToImg(faceDom);
}

function insertFace(e) {
  if (e.target.id && e.target.id.substr(0, 4) === "face") {
    xx.value += "{" + e.target.id.replace("face", "face:") + "}";
  }
  xx.focus();
}

function numToDate(val) {
  if (val) {
    return (
      "" +
      val.substr(0, 4) +
      "-" +
      val.substr(4, 2) +
      "-" +
      val.substr(6, 2) +
      " " +
      val.substr(8, 2) +
      ":" +
      val.substr(10, 2) +
      ":" +
      val.substr(12, 2) +
      ""
    );
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
