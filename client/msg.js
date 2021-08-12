var ws = new WebSocket(config.wsIp + config.wsPortMsg);

ws.onmessage = function (msg) {
  console.log(666.102, msg.data);
  msgShow(msg.data);
};

function msgSend() {
  let msg = JSON.stringify([789, xx.value]);
  console.log(666.101, msg);
  ws.send(msg);
}

function msgShow(msg) {
  if (localStorage.getItem("msg") !== msg) {
    localStorage.setItem("msg", msg);
    const msgDom = document.getElementById("msg");
    msgDom.innerText = msg;
  }
}

function msgShow1(msg) {
  if (localStorage.getItem("msg") !== msg) {
    localStorage.setItem("msg", msg);
    const msgDom = document.getElementById("msg");
    let msgText = msgDom.innerText;
    if (!msgText) {
      msgText = localStorage.getItem("msgText");
    }
    msgText = msg + "\n" + msgText;
    msgDom.innerText = msgText;
    localStorage.setItem("msgText", msgText);
  }
}
