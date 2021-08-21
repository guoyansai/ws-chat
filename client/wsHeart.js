var wsHeart = {
  timeout: 3000, // 心跳延迟时间
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
      console.log(666.301, "ping" + new Date().toLocaleString());
      this.serverTimeoutObj = setTimeout(() => {
        console.log(666.303, "close" + new Date().toLocaleString());
        this.reClose();
      }, this.timeout);
    }, this.timeout);
  },
  reConnect: function () {
    if (!this.lockConnect) {
      wsTime--;
      this.lockConnect = true;
      this.connectTimeoutObj = setTimeout(() => {
        console.log(666.301, "重连" + new Date().toLocaleString());
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
      console.log(666.101, e);
    }
  },
};
