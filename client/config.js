var config = {
  wsIp: "ws://localhost:",
  wsPortMsg: 909,
  wsPortUser: 900,
  httpPort: 1909,
  epVal: "-",
  msgType: {
    myUid: 10,
    broadMsg: 20,
    broadUser: 21,
    broadChangeUser: 22,
    broadInRoom: 23,
    broadOutRoom: 24,
    wsChangeUser: 32,
    wsInRoom: 33,
    wsOutRoom: 34,
  },
  msgTypeDes: "0消息1发送uid2进入3离开4更新user5广播user",
  userTmp: ["-", 0, "2012-12-12", "-", "-"],
  userTmpDes: ["名字", "头像", "生日", "城市", "签名"],
  msgTmp: [0, 0, "-", "-"],
  msgTmpDes: ["用户ID", "消息类型", "消息内容", "时间"],
};
try {
  module.exports = config;
} catch {}
