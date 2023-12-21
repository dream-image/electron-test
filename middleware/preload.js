const fs = require("fs");
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

const { contextBridge, ipcRenderer, clipboard } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"), //将主函数的ping暴露给渲染函数，渲染进程通过windows全局变量就可以访问
  // 除函数之外，我们也可以暴露变量
});
console.log(fs);
contextBridge.exposeInMainWorld("button", {
  click: () => ipcRenderer.invoke("send"),
});
contextBridge.exposeInMainWorld("rightClick", {
  click: () => ipcRenderer.invoke("rightClick"),
});
ipcRenderer.on("picture", (event, data) => {
  let dataUrl = data.dataUrl;
  console.log(dataUrl)
  // let imgDom = document.createElement("img");
  // imgDom.src = dataUrl;
  // document.body.appendChild(imgDom);
});
