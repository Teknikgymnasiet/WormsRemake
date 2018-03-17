const WindowManager = require('./WindowManager.js');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  this.mainWindow = new BrowserWindow(WindowManager.WindowOptions);
  this.mainWindow.loadURL(`http://127.0.0.1:1337/elec`);

  //this.mainWindow.webContents.openDevTools();
  this.mainWindow.setMenu(null);
  this.mainWindow.on('closed', function() {
    this.mainWindow = null;
  });
}

function toggleFullscreen() {
  this.mainWindow.setFullscreen(!this.mainWindow.isFullscreen());
}

function ElectronIsRunning() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(" electron/") > -1) {
      return true;
  }
}

app.on('ready', createWindow);

// Quit when all windows are closed on OSX and Linux
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// Safety
app.on('activate', function() {
  if (this.mainWindow === null) {
    WindowManager.createWindow();
  }
});