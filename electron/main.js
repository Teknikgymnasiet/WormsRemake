const electron = require('electron');
const app = electron.app;
// create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 600, height: 900});
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed on OSX and Linux
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
// Safety
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});