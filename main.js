const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Menu,
  MenuItem,
  Tray,
  nativeImage,
  clipboard
} = require("electron");

const WinState = require("electron-win-state").default;
const path = require("path");

const winState = new WinState({
  defaultWidth: 800,
  defaultHeight: 600,
  // other winState options, see below
});
var menuPicture = Menu.buildFromTemplate([
  {
   label: "复制" ,
   click:(menuItem, browserWindow, event)=>{
    console.log(image)
    clipboard.writeImage(image)
    
   }
  },

]);

var menuNormal = Menu.buildFromTemplate([
  { label: "这是普通菜单的复制", role: "copy" },
  {
    label:"粘贴",
    click:(menuItem, browserWindow, event)=>{
      let img = clipboard.readImage();
      let dataUrl = img.toDataURL();
      console.log(dataUrl)
      browserWindow.webContents.send("picture",{dataUrl})
    }
  }
]);

var image

const createWindow = () => {
  const win = new BrowserWindow({
    ...winState.winOptions,
    // frame:false,//没边框
    titleBarStyle: "hiddenInset",
    icon: __dirname + "/static/猫羽雫头像.ico",
    show: false, //先不显示，当其准备好显示的时候再显示，这样才能获取焦点
    alwaysOnTop: true, //让其置顶，下面来个延时器，让其再不是置顶
    webPreferences: {
      preload: path.join(__dirname, "middleware/preload.js"), // 预加载js
      // nodeIntegration:true, //是否开启node环境, 这个启用后会自动禁用沙盒 就是 sandbox会为false
      // contextIsolation:true //是否开启上下文隔离,默认是隔离的,不建议使用这两个开启node环境

      sandbox: false,
    },
  });
  setTimeout(() => {
    win.setAlwaysOnTop(false);
  }, 500);

  win.on("ready-to-show", () => {
    win.show(); // 显示窗口
    win.focus(); // 让窗口获得焦点
  });

  win.webContents.on("did-finish-load", () => {
    console.log("页面全部资源加载完毕");
  });

  win.webContents.on("dom-ready", () => {
    console.log("dom渲染完毕");
  });

  win.webContents.on("context-menu", (e, params) => {
    //鼠标右键监听
    // console.log(e, params);
    // win.webContents.executeJavaScript("alert('这是注入的JavaScript代码')");
    if (params.srcURL != "") {
      image = nativeImage.createFromPath(params.srcURL)
      // console.log(image,params.srcURL)
      console.log(image.isEmpty())
      menuPicture.popup();
      
    }else{
      menuNormal.popup()
    }
  });

  winState.manage(win);
  // win.loadFile("index.html");
  win.loadURL("http://xyworld.xyz/")
  // win.webContents.openDevTools(); //打开开发者工具
};
let tray;
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath("./static/白毛兽耳小版.png");
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "separator", type: "separator" },
    { label: "normal", type: "normal" },
    { label: "Item3", type: "radio", checked: true },
    { label: "checkbox", type: "checkbox" },
    {label:"退出",type:'normal', click:(menuItem,browserWindow,keyboardEvent)=>{
      if (process.platform !== "darwin") app.quit();

    }}
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("测试");
  tray.setTitle("这是我的electron桌面应用");

  //系统托盘中设置图标，就是桌面右下角的东西

  ipcMain.handle("ping", () => {
    console.log("主进程的ping被渲染进程调用啦");
    return "success";
  });

  ipcMain.handle("send", (event, msg) => {
    console.log("发布一个事件");
    if (Notification.isSupported()) {
      console.log("支持");
      new Notification({
        title: "这是一个通知",
        subtitle: "来自electron",
        body: "这是正文",
        icon: "./static/icon@2x.png",
        timeoutType: "default",
      }).show();
      //显示系统通知
    } else {
      console.log("不支持");
    }
    return "被调用了";
  });

  ipcMain.handle("rightClick", (event, msg) => {
    menuNormal.popup();

    //右键菜单栏
  });


  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("browser-window-created", () => {});
app.setUserTasks([
  {
    program: "http://xyworld.xyz",
    arguments: "--new-window",
    iconPath: process.execPath,
    iconIndex: 0,
    title: "blog",
    description: "go to my blog",
  },
]);
//在任务栏中右键的新增效果
