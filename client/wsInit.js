var $menu = document.getElementById("menu");
var $saycount = document.getElementById("saycount");
var $cardarea = document.getElementById("cardarea");
var $card = document.getElementById("card");
var $user = document.getElementById("user");
var $userform = document.getElementById("userform");
var $msg = document.getElementById("msg");
var $msgform = document.getElementById("msgform");
var $msgformtool = document.getElementById("msgformtool");
var $msgformtools = document.getElementById("msgformtools");
var $msgformsaytool = document.getElementById("msgformsaytool");
var $msgformdx = document.getElementById("msgformdx");
var $xx = document.getElementById("xx");
var $fh = document.getElementById("fh");
var $infh = document.getElementById("infh");
var $usercount = document.getElementById("usercount");

var dataUserKey = "user";
var dataMsgKey = "msg";

var ws = null;
var wsTime = 10; // 重连次数
var wsUrl = config.wsIp + config.wsPortMsg;

function wsInit() {
  var rqfh = Number((location.href+'#0').split("#")[1]);
  if (rqfh > 0) {
    infhUrl(rqfh);
  }

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
  $fh.addEventListener(
    "input",
    function (e) {
      fhOnInput(e);
    },
    true
  );
  $infh.addEventListener(
    "click",
    function (e) {
      infhClick();
    },
    true
  );
  $msg.ondblclick = function (e) {
    if ($msg.scrollTop === 0) {
      $msg.scrollTop = $msg.scrollHeight;
    } else {
      $msg.scrollTop = 0;
    }
  };
  $msgformtools.addEventListener(
    "click",
    function (e) {
      insertFace(e);
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
    var _this = this;
    this.timeoutObj = setTimeout(function () {
      ws.send("ping");
      _this.serverTimeoutObj = setTimeout(function () {
        _this.reClose();
      }, _this.timeout);
    }, _this.timeout);
  },
  reConnect: function () {
    if (!this.lockConnect) {
      wsTime--;
      this.lockConnect = true;
      var _this = this;
      this.connectTimeoutObj = setTimeout(function () {
        _this.newWs();
        _this.lockConnect = false;
      }, _this.lockConnectTimeout);
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
