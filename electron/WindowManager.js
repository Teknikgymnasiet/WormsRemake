"use strict";
exports.__esModule = true;
var electron = require('electron');
var elecwin = require('./main.js');
// create native browser window.
var BrowserWindow = electron.BrowserWindow;
var WindowManager = /** @class */ (function () {
    function WindowManager() {
        // Our Electron instance
        this.mainWindow = elecwin.mainWindow;
        this.windowTitle = "PhaserJS Worms Remake";
        this.gameIcon = "../assets/gameIcon.png";
        this.webPreferences = {
            devTools: true,
            nodeIntegration: true,
            // Read about multithreading, left false as default
            nodeIntegrationInWorker: false,
            plugins: false,
            zoomFactor: 1.0
        };
        this.WindowOptions = {
            width: 600,
            height: 900,
            title: this.windowTitle,
            icon: this.gameIcon,
            resizable: false,
            maximizable: false,
            fullscreenable: true,
            enableLargerThanScreen: false,
            webPreferences: this.webPreferences
        };
    }
    WindowManager.prototype.createWindow = function () {
        this.mainWindow = new BrowserWindow(this.WindowOptions);
        this.mainWindow.loadURL("http://127.0.0.1:1337/elec");
        this.mainWindow.webContents.openDevTools();
        this.mainWindow.setMenu(null);
        this.mainWindow.on('closed', function () {
            this.mainWindow = null;
        });
    };
    WindowManager.prototype.toggleFullscreen = function () {
        this.mainWindow.setFullscreen(!this.mainWindow.isFullscreen());
    };
    WindowManager.prototype.ElectronIsRunning = function () {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(" electron/") > -1) {
            return true;
        }
    };
    // Make keybind?
    WindowManager.prototype.openDevTools = function () {
        this.mainWindow.webContents.openDevTools();
    };
    return WindowManager;
}());
exports.WindowManager = WindowManager;
