const electron = require('electron');
const elecwin = require('./main.js');
// create native browser window.
const BrowserWindow = electron.BrowserWindow;

export class WindowManager {
    // Our Electron instance
    public mainWindow = elecwin.mainWindow;

    public windowTitle: string = "PhaserJS Worms Remake";
    public gameIcon = "../assets/gameIcon.png";

    protected webPreferences = {
        devTools: true,
        nodeIntegration: true,
        // Read about multithreading, left false as default
        nodeIntegrationInWorker: false,
        plugins: false,
        zoomFactor: 1.0,
    };

    protected WindowOptions = {
        width: 600,
        height: 900,
        title: this.windowTitle,
        icon: this.gameIcon,
        resizable: false,
        maximizable: false,
        fullscreenable: true,
        enableLargerThanScreen: false,
        webPreferences: this.webPreferences,
    };

    public createWindow() {
        this.mainWindow = new BrowserWindow(this.WindowOptions);

        this.mainWindow.loadURL(`http://127.0.0.1:1337/elec`);
        this.mainWindow.webContents.openDevTools();
        this.mainWindow.setMenu(null);

        this.mainWindow.on('closed', function() {
            this.mainWindow = null;
        });
    }

    public toggleFullscreen(): void {
        this.mainWindow.setFullscreen(!this.mainWindow.isFullscreen());
    }

    public ElectronIsRunning(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(" electron/") > -1) {
            return true;
        }
    }

    // Make keybind?
    public openDevTools(): void {
        this.mainWindow.webContents.openDevTools();
    }
}
