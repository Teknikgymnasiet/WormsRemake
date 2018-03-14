const WindowManager = require('./WindowManager');
const app = WindowManager.app;
// create native browser window.
const BrowserWindow = WindowManager.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = WindowManager.mainWindow;

app.on('ready', WindowManager.createWindow);

// Quit when all windows are closed on OSX and Linux
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// Safety
app.on('activate', function() {
  if (this.mainWindow === null) {
    createWindow();
  }
});
