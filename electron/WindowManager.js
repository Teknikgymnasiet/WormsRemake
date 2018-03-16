"use strict";
exports.__esModule = true;
var WindowManager = /** @class */ (function () {
    function WindowManager() {
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
    WindowManager.toggleFullscreen = function () {
        WindowManager.mainWindow.setFullscreen(!WindowManager.mainWindow.isFullscreen());
    };
    WindowManager.ElectronIsRunning = function () {
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
