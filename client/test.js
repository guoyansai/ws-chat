var i = 1;
$(function () {
  $(".box").mCustomScrollbar({ theme: "inset-2-dark" });
  var wsObj = null;

  var mediaRecorder = null;
  var recordedBlobs;
  var recordedAudio = document.querySelector("audio#recorded");
  var recordButton = $("#btn_record");
  recordButton.on("click", toggleRecording);

  //test button
  //        var testButton = document.querySelector('button#test_btn');
  //        testButton.onclick = testButtonPlay;

  var contraints = { audio: true };

  //更新滚动条
  function updateScrollbar() {
    $(".box")
      .mCustomScrollbar("update")
      .mCustomScrollbar("scrollTo", "bottom", {
        axis: "y", // 竖直滚动条
      });
  }
  //生成随机数
  function num(m, n) {
    return parseInt(Math.random() * (n - m));
  }
  //发送信息
  function sendMsg() {
    var msg = bb.value;
    var name = $("#name").val();
    if (name == "" || name == null) {
      alert("请设置您的昵称！");
      return;
    }
    if (msg == "") {
      alert("消息不能为空！");
      return;
    }
    var type = "chatInfo";
    var obj = { name: name, msg: msg, type: type };
    wsObj.send(JSON.stringify(obj));
    bb.value = "";
  }

  $("#setName").click(function () {
    name = $("#name").val();
    if (name == "" || name == null || name == " ") {
      alert("昵称不合法！");
      return;
    }

    var name = $("#name").val();
    var msg = name + "已上线......";
    var type = "loginInfo";
    var obj = { name: name, msg: msg, type: type };

    wsObj.send(JSON.stringify(obj));
  });

  wsObj = new WebSocket("ws://127.0.0.1:8182"); //建立连接
  wsObj.onopen = function () {
    //发送请求
    console.log("连接状态", wsObj);
  };
  wsObj.onmessage = function (e) {
    //获取后端响应
    var data = JSON.parse(e.data);

    switch (data.type) {
      case "loginInfo":
        var msg = data.msg;
        var subDiv = $("<div></div>");
        var msgDiv = $("<div></div>");

        $(subDiv).addClass("item");
        $(msgDiv).addClass("loginDiv");
        $(msgDiv).html(msg);

        msgDiv.appendTo(subDiv);
        subDiv.appendTo($(".mCSB_container"));
        updateScrollbar();

        break;
      case "chatInfo":
        var name = data.name;
        var msg = data.msg;

        var subDiv = $("<div></div>");
        var h5 = $("<h5></h5>");
        var p = $("<p></p>");

        h5.html(name);
        p.html(msg);

        $(p).addClass("response");
        $(subDiv).addClass("item");
        $(h5).addClass("pp");

        p.appendTo(subDiv);
        h5.prependTo(subDiv);
        subDiv.appendTo($(".mCSB_container"));

        updateScrollbar();
        break;

      case "systemInfo":
        var msg = data.msg;
        var subDiv = $("<div></div>");
        var msgDiv = $("<div></div>");

        $(subDiv).addClass("item");
        $(msgDiv).addClass("systemDiv");
        $(msgDiv).html(msg);

        msgDiv.appendTo(subDiv);
        subDiv.appendTo($(".mCSB_container"));
        updateScrollbar();
        break;

      case "audioInfo":
        var tmprecordedBlobs = data.recordedBlobs;
        var name = data.name;
        // alert(name + "发来一条语音消息！");
        var arrayBuffer = Object.keys(tmprecordedBlobs).map((el) => {
          return tmprecordedBlobs[el];
        });
        var superBuffer = new Blob([new Uint8Array(arrayBuffer)], {
          type: "audio/ogg; codecs=opus",
        });
        //console.log(superBuffer);

        var subDiv = $("<div></div>");
        var h5 = $("<h5></h5>");
        var auDiv = $("<div></div>");
        h5.html(name);
        auDiv.html(" ");
        $(auDiv).attr("s", i++);
        var _auDiv_hidden = $(
          "<audio 'hidden' class='recorded_auDiv'></audio>"
        );
        $(_auDiv_hidden).attr("s", i - 1);

        $(auDiv).attr("isplay", false);
        $(auDiv).addClass("response").addClass("auDiv");
        $(subDiv).addClass("item");
        $(h5).addClass("pp");

        auDiv.appendTo(subDiv);
        h5.prependTo(subDiv);
        _auDiv_hidden.appendTo(subDiv);
        subDiv.appendTo($(".mCSB_container"));

        $('div[s="' + (i - 1) + '"]')
          .get(0)
          .addEventListener("click", (e) => {
            var x = $(e.target).attr("s");
            if ($(auDiv).attr("isplay") == "false") {
              $('audio[s="' + x + '"]').get(0).currentTime = 0;
              // console.log(e.target);
              $(auDiv).attr("isplay", true);
              $(auDiv).css("color", "red");
              console.log($('audio[s="' + x + '"]').get(0));
              $('audio[s="' + x + '"]')
                .get(0)
                .play();
            } else {
              $('audio[s="' + x + '"]')
                .get(0)
                .pause();
              $(auDiv).attr("isplay", false);
              $(auDiv).css("color", "green");
            }
          });

        $('audio[s="' + (i - 1) + '"]').get(0).src =
          window.URL.createObjectURL(superBuffer);

        $('audio[s="' + (i - 1) + '"]')
          .get(0)
          .addEventListener("canplay", function (e) {
            var audioDuration = e.target.duration;
            if (audioDuration == Infinity) {
              $('audio[s="' + (i - 1) + '"]').get(0).currentTime = 1e101;
              $('audio[s="' + (i - 1) + '"]').get(0).ontimeupdate =
                function () {
                  this.ontimeupdate = () => {
                    return;
                  };
                  $('audio[s="' + (i - 1) + '"]').get(0).currentTime = 1e101;
                  $('audio[s="' + (i - 1) + '"]').get(0).currentTime = 0;
                };
            }

            var t = i - 1;
            $('div[s="' + t + '"]').html(
              parseInt($('audio[s="' + (i - 1) + '"]').get(0).duration) + "s"
            );
          });

        updateScrollbar();
        break;

      default:
        break;
    }
  };
  wsObj.onclose = function (e) {
    console.log(e);
  };
  wsObj.onerror = function (e) {
    console.log("error");
  };

  $(".btn_send").click(function () {
    //send:
    sendMsg();
  });

  $(window).on("keydown", function (e) {
    if (e.which == 13) {
      sendMsg();
      return false;
    }
  });

  function handleSuccess(stream) {
    console.log("getUserMedia() got stream: ", stream);
    window.stream = stream;
  }

  function handleError(error) {
    console.log("getUserMedia() error: ", error);
  }

  //获取音频权限
  navigator.mediaDevices
    .getUserMedia(contraints)
    .then(handleSuccess)
    .catch(handleError);

  function handleDataAvailable(event) {
    recordedBlobs.push(event.data);
  }

  function handleStop(event) {
    console.log("Recorder stopped: ", event);
    sendAudio();
  }

  function toggleRecording() {
    if (recordButton.text() == "发送语音") {
      // $("#btn_record").addClass('btn_record_ison');
      startRecording();
    } else {
      // $("#btn_record").removeClass('btn_record_ison');
      stopRecording();
      recordButton.text("发送语音");
    }
  }

  function startRecording() {
    recordedBlobs = [];
    var options = { mimeType: "audio/webm;codecs=vp9" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + "is not Supported");
      options = { mimeType: "audio/webm;codecs=vp8" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + "is not Supported");
        options = { mimeType: "audio/webm" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + "is not Supported");
          options = { mimeType: "" };
        }
      }
    }
    console.log(options);
    try {
      mediaRecorder = new MediaRecorder(window.stream);
    } catch (e) {
      console.error("error! create MediaRecorder(): " + e);
      return;
    }
    recordButton.text("停止");
    //            testButton.textContent = 'Stop';
    mediaRecorder.start();
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

    console.log(mediaRecorder.state);
    console.log("MediaRecorder started", mediaRecorder);
  }

  function stopRecording() {
    mediaRecorder.stop();
    console.log("Recorded Blobs: ", recordedBlobs);
    console.log(mediaRecorder.state);
  }

  function sendAudio() {
    var name = $("#name").val();
    if (name == "" || name == null) {
      alert("请设置您的昵称！");
      return;
    }
    var type = "audioInfo";

    var reader = new FileReader();
    var superBuffer = new Blob(recordedBlobs, {
      type: "audio/ogg; codecs=opus",
    });
    var res;
    console.log(recordedBlobs);
    console.log(superBuffer);
    reader.readAsArrayBuffer(superBuffer);
    reader.onload = function () {
      res = new Uint8Array(reader.result);
      //    console.log(res);
      var obj = { name: name, recordedBlobs: res, type: type };
      wsObj.send(JSON.stringify(obj));
    };
  }
});
