var config = {
  wsIp: "ws://tc.asai.cc:",
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
    broadMsgFetch: 25,
    broadMsgAi: 26,
    wsChangeUser: 32,
    wsInRoom: 33,
    wsOutRoom: 34,
  },
  faceCount: 147,
  helloMsg: ["欢迎", "帅哥靓妹看过来", "你好", "嗨，吃过啦？"],
  userTmp: [1, "-", 0, "2012-12-12", "-", "-"],
  userTmpDes: ["房号", "名字", "头像", "生日", "城市", "签名"],
  userTmpName: ["fh", "mz", "tx", "sr", "cs", "qm"],
  msgTmp: [1, 0, 0, "-", 0, "-"],
  msgTmpDes: ["房号", "用户ID", "消息类型", "消息内容", "说话对象", "时间"],
};
try {
  module.exports = config;
} catch(e) {}
