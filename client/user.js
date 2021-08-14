function userSendSubmit() {
  dataObj.arrUser[0] = mz.value;
  dataObj.arrUser[1] = tx.value;
  dataObj.arrUser[2] = sr.value;
  dataObj.arrUser[3] = cs.value;
  dataObj.arrUser[4] = wb.value;
  localStorage.setItem(dataUserKey, toStr(dataObj.arrUser));
  initDataUser();
}
