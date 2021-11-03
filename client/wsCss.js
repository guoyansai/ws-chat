var $cssvar = document.getElementById("cssvar");

var cssObj = {
    bgimg: "",
    bodycolor: "#FFFFFF",
    fontcolorlight: "#999999",
    fontcolor: "#000000",
    fontsizesmall: "12px",
    fontsize: "16px",
    bordercolor: "#d8d8d8",
    bgcolor: "rgba(255, 255, 255, 0.8)",
    bgcolorspe: "rgba(252, 248, 230, 0.8)",
    bglinearmenu:
      "linear-gradient(rgba(255, 255, 255, 0),rgba(255, 255, 255, 1))",
  };

function initCssVar() {
    var cssStr ='body {background-image:'+cssObj.bgimg+';background-color:'+cssObj.bodycolor+';color:'+cssObj.fontcolor+';font-size:'+cssObj.fontsize+';}'+
    'h1 label {font-size:'+cssObj.fontsizesmall+';color:'+cssObj.fontcolorlight+';}'+
    'h1 input {border-width:1px;border-style:solid;border-color:'+cssObj.fontcolorlight+';}'+
    'h1 button {font-size:'+cssObj.fontsizesmall+';border-color:'+cssObj.fontcolorlight+';}'+
    '#menu {border-bottom-color:'+cssObj.bordercolor+';}'+
    '.curmenu,.menu div:hover {border-top-color:'+cssObj.bordercolor+';border-left-color:'+cssObj.bordercolor+';border-right-color:'+cssObj.bordercolor+';background-image:'+cssObj.bglinearmenu+';}'+
    '#card {border-top-color:'+cssObj.bordercolor+';border-bottom-color:'+cssObj.bordercolor+';border-left-color:'+cssObj.bordercolor+';border-right-color:'+cssObj.bordercolor+';background-color:'+cssObj.bgcolor+';}'+
    '.cuid {color:'+cssObj.fontcolorlight+';}'+
    '.cuqm {font-size:'+cssObj.fontsizesmall+';}'+
    '.cucs,.cusr,.cusj {font-size:'+cssObj.fontsizesmall+';}'+
    '#userform input,#userform select {background-color:rgba(255, 255, 255, 0);color:'+cssObj.fontcolor+';}'+
    '#userform select > option {background-color:'+cssObj.bodycolor+';color:'+cssObj.fontcolor+';}'+
    '.userd,.usertx {border-color:'+cssObj.bordercolor+';background-color:'+cssObj.bgcolor+';}'+
    '#msgform {border-top-color:'+cssObj.bordercolor+';}'+
    '.astbg,#msgformtools,#msgformsaytool:hover {background-color:'+cssObj.bgcolorspe+';}'+
    '#msgformdx {font-size:'+cssObj.fontsizesmall+';color:'+cssObj.fontcolorlight+';}'+
    '#msgformsay > input {background-color:rgba(255, 255, 255, 0);color:'+cssObj.fontcolor+';}'+
    '.msgg {border-color:'+cssObj.bordercolor+';background-color:'+cssObj.bgcolorspe+';color:'+cssObj.fontcolorlight+';font-size:'+cssObj.fontsizesmall+';}'+
    '.cxx {border-color:#d8d8dd;}'+
    '.csj {color:'+cssObj.fontcolorlight+';font-size:'+cssObj.fontsizesmall+';}'+
    '.umz {font-size:'+cssObj.fontsizesmall+';}'+
    '.lx22,.lx23,.lx24 {font-size:'+cssObj.fontsizesmall+';color:'+cssObj.fontcolorlight+';}';

    if($cssvar.styleSheet) {
      $cssvar.styleSheet.cssText = cssStr;
    } else {
      $cssvar.innerHTML = cssStr;
    }
  }

  initCssVar();