var t = Date.now();

// 打开一个WebSocket:
var ws = new WebSocket(config.wsIp + config.wsPortMsg);
// 响应onmessage事件:
ws.onmessage = function (msg) {
  console.log(msg);
};
// 给服务器发送一个字符串:
ws.send("Hello!");
