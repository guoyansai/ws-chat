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
%><!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title><%=chatTitle%></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content="<%=chatTitle%>" />
    <meta name="description" content="<%=chatTitle%>" />
    <meta name="copyright" content="<%=chatTitle%>" />
    <link rel="stylesheet" type="text/css" href="css.css" />
  </head>
  <body>
    <div id="area">
      <div id="bar">
        <label id="bartit" for="fh">
          <h1><%=chatTitle%></h1>
          <input type="number" name="fh" id="fh" value="1" min="1" max="99" />
          <span id="fhdec">号房</span>
          <button id="infh">点击进入</button>
        </label>
        <div id="barmid"></div>
        <div id="barset" onclick="decAuto()">···</div>
      </div>
      <div id="music"></div>
      <div id="decarea">
        <div id="dectool"><div id="decclose" onclick="decAuto()">×</div></div>
        <div id="dec">
          <div id="decmenu" class="menu">
            <div id="menu0" onclick="menuClick(0)">
              在线<span id="usercount">1人</span>
            </div>
            <div id="menu1" onclick="menuClick(1)">更新昵称</div>
          </div>
          <div id="decmain">
            <div id="main0">
              <div id="user"><div class="user">用户列表</div></div>
            </div>

            <div id="main1">
              <div id="userform">
                　　　<img id="tximg" src="" />
                <label for="tx">
                  头像：
                  <select id="tx" name="tx" onchange="showTx(event)">
                    <script>
                      function getTxOption() {
                        var i = 0;
                        var strDom = "";
                        while (i < 95) {
                          strDom +=
                            "<option value=" + i + ">头像" + i + "</option>";
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
                  <input
                    type="text"
                    id="mz"
                    name="mz"
                    maxlength="20"
                    value=""
                  />
                </label>
                <label for="sr">
                  生日：
                  <input
                    type="date"
                    id="sr"
                    name="sr"
                    maxlength="20"
                    value=""
                  />
                </label>
                <label for="cs">
                  城市：
                  <input
                    type="text"
                    id="cs"
                    name="cs"
                    maxlength="10"
                    value=""
                  />
                </label>
                <label for="qm">
                  签名：
                  <input
                    type="text"
                    id="qm"
                    name="qm"
                    maxlength="60"
                    value=""
                  />
                </label>
                <button onclick="userSendSubmit()">更新个人信息</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="chat">
        <div id="cardarea">
          <div id="card">loading......</div>
        </div>

        <div id="msg">
          <div class="msgg">
            欢迎光临！<%=chatTitle%>是个简洁的聊天室而已，随意聊...
          </div>
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
      <script src="wsChat.js"></script>
      <script src="wsClient.js"></script>
    </div>
  </body>
</html>