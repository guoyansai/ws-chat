<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%><%
dim chatTitle,chatType,Server_Name
Server_Name = lcase(CStr(Request.ServerVariables("Server_Name")))
if right(Server_Name,7)="asai.cc" then
chatTitle="阿赛"
elseif right(Server_Name,7)="909.pub" then
chatType=909
chatTitle="啾噗"
elseif right(Server_Name,9)="02590.com" then
chatTitle="南京"
else
chatTitle=""
end if
chatTitle=chatTitle&"AI聊天室"
%><!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title><%=chatTitle%></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content="<%=chatTitle%>" />
    <meta name="description" content="<%=chatTitle%>" />
    <meta name="copyright" content="<%=chatTitle%>" />
    <style id="cssvar"></style>
    <link type="text/css" href="css.css" rel="stylesheet" />
  </head>
  <body>
    <div id="area">
      <h1>
        <%=chatTitle%>
        <label for="fh">
          <input type="number" name="fh" id="fh" value="1" min="1" max="99" />
          号房
        </label>
        <button id="infh">进入</button>
      </h1>
      <div id="music"></div>
      <div id="chat">
        <div id="menu" class="menu">
          <div onclick="menuClick(0)">聊天室<sup id="saycount"></sup></div>
          <div onclick="menuClick(1)">
            在线人员<sup id="usercount">1人</sup>
          </div>
          <div onclick="menuClick(2)">我的信息<sup id="mycount"></sup></div>
        </div>

        <div id="cardarea">
          <div id="card">loading......</div>
        </div>

        <div id="userform">
          <label for="tx">
            头像：
            <select id="tx" name="tx">
              <script>
                function getTxOption() {
                  var i = 0;
                  var strDom = "";
                  while (i < 95) {
                    strDom += "<option value=" + i + ">头像" + i + "</option>";
                    i++;
                  }
                  return strDom;
                }
                document.write(getTxOption());
              </script>
            </select>
            <button onclick="cardShowTx(tx.value)">查看头像</button>
          </label>
          <label for="mz">
            名字：
            <input type="text" id="mz" name="mz" maxlength="20" value="" />
          </label>
          <label for="sr">
            生日：
            <input type="date" id="sr" name="sr" maxlength="20" value="" />
          </label>
          <label for="cs">
            城市：
            <input type="text" id="cs" name="cs" maxlength="10" value="" />
          </label>
          <label for="qm">
            签名：
            <input type="text" id="qm" name="qm" maxlength="60" value="" />
          </label>
          <button onclick="userSendSubmit()">更新个人信息</button>
        </div>

        <div id="user"><div class="user">用户列表</div></div>

        <div id="msg">
          <div class="msgg">欢迎光临！<%=chatTitle%>就是个简洁的聊天室而已，随意聊...</div>
        </div>

        <div id="msgform">
          <div id="msgformsay">
            <label id="msgformsaytool" for="xx" onclick="msgTool()">☺</label>
            <div id="msgformdx" for="xx" onclick="setMsgDx(0)"></div>
            <input
              type="text"
              id="xx"
              name="xx"
              maxlength="200"
              value=""
              placeholder="请在这里输入发言内容，按Enter键或发送按钮提交。"
            />
            <button onclick="msgSendSubmit()">发送</button>
          </div>
          <div id="msgformtool">
            <div id="msgformtools">
              工具箱<button onclick="localClear()">清空</button>
            </div>
          </div>
        </div>
      </div>
      <script src="config.js"></script>
      <script src="wsInit.js"></script>
      <script src="wsCss.js"></script>
      <script src="wsClient.js"></script>
    </div>
  </body>
</html>
