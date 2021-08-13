//导入模块
var ws = require("ws");

//创建服务器
var wsServer = new ws.Server({
  host: "127.0.0.1",
  port: 8182,
});
console.log("listening localhost:8182");

// 广播
wsServer.broadcast = function broadcast(str) {
  wsServer.clients.forEach(function each(client) {
    client.send(str);
  });
  //console.log(wsServer.clients.length);
};

//建立连接后
wsServer.on("connection", function connection(ws) {
  ws.on("message", function incoming(obj) {
    var o = JSON.parse(obj);
    switch (o.type) {
      case "loginInfo":
        var str = JSON.stringify({
          msg: o.msg,
          type: o.type,
        });
        this.name = o.name;
        wsServer.broadcast(str);
        break;
      case "chatInfo":
        var str = JSON.stringify({
          name: o.name,
          msg: o.msg,
          type: o.type,
        });
        wsServer.broadcast(str);
        break;
      case "systemInfo":
        var str = JSON.stringify({
          msg: o.msg,
          type: o.type,
        });
        wsServer.broadcast(str);
        break;
      case "audioInfo":
        var str = JSON.stringify({
          name: o.name,
          recordedBlobs: o.recordedBlobs,
          type: o.type,
        });
        wsServer.broadcast(str);
        break;

      default:
        break;
    }
  });

  ws.on("close", function (o) {
    try {
      console.log(this.name);
      console.log("from server: close");

      var str = JSON.stringify({
        msg: this.name + "已下线......",
        type: "systemInfo",
      });
      wsServer.broadcast(str);
    } catch (e) {
      console.log(e);
    }
  });
});
