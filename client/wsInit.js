const $menu = document.getElementById("menu");
const $cardarea = document.getElementById("cardarea");
const $card = document.getElementById("card");
const $user = document.getElementById("user");
const $userform = document.getElementById("userform");
const $msg = document.getElementById("msg");
const $msgform = document.getElementById("msgform");
const $msgformtool = document.getElementById("msgformtool");
const $msgformsaytool = document.getElementById("msgformsaytool");
const $xx = document.getElementById("xx");
const $usercount = document.getElementById("usercount");

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

let ws = null;
let wsTime = 10; // 重连次数
const wsUrl = config.wsIp + config.wsPortMsg;

function wsInit() {
  ws.onopen = function () {
    wsHeart.reStart();
  };
  ws.onmessage = function (e) {
    wsHeart.reStart();
    if (e.data === "pong") {
      // console.log(666.909, "pong");
    } else {
      // 处理正常消息的地方
      chatShow("" + e.data);
    }
  };
  ws.onclose = function () {
    if (wsTime > 0) {
      wsHeart.reConnect();
    } else {
      wsHeart.reClose();
    }
  };
  ws.onerror = function () {
    if (wsTime > 0) {
      wsHeart.reConnect();
    } else {
      wsHeart.reClose();
    }
  };

  window.onbeforeunload = function () {
    wsHeart.reClose();
  };

  $xx.onkeydown = function (e) {
    if (e.key === "Enter") {
      msgSendSubmit();
    }
  };
  $cardarea.addEventListener(
    "click",
    function (e) {
      cardHidden();
    },
    true
  );
}

var wsHeart = {
  timeout: 15000, // 心跳延迟时间
  timeoutObj: null,
  serverTimeoutObj: null,
  connectTimeoutObj: null,
  lockConnect: false,
  lockConnectTimeout: 2000, // 重连延迟时间
  reSet: function () {
    wsTime = 10;
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    clearTimeout(this.connectTimeoutObj);
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    this.connectTimeoutObj = null;
  },
  reClose: function () {
    this.reSet();
    ws.close();
  },
  reStart: function () {
    this.reSet();
    this.reCheck();
  },
  reCheck: function () {
    this.timeoutObj = setTimeout(() => {
      ws.send("ping");
      this.serverTimeoutObj = setTimeout(() => {
        this.reClose();
      }, this.timeout);
    }, this.timeout);
  },
  reConnect: function () {
    if (!this.lockConnect) {
      wsTime--;
      this.lockConnect = true;
      this.connectTimeoutObj = setTimeout(() => {
        this.newWs();
        this.lockConnect = false;
      }, this.lockConnectTimeout);
    }
  },
  newWs: function () {
    try {
      if ("WebSocket" in window) {
        ws = new WebSocket(wsUrl);
        wsInit();
      }
    } catch (e) {
      this.reConnect();
    }
  },
};

wsHeart.newWs();
