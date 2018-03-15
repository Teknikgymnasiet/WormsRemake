const WindowManager = require('./WindowManager.js');
const electron = require('electron');
const app = electron.app;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

app.on('ready', WindowManager.createWindow());

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
