var t = Date.now();

// 打开一个WebSocket:
var ws = new WebSocket("ws://localhost:3000/test");
// 响应onmessage事件:
ws.onmessage = function (msg) {
  console.log(msg);
};
// 给服务器发送一个字符串:
ws.send("Hello!");