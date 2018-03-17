import {BrowserWindow} from 'electron';
export class WindowManager {
    // Our Electron instance
    static mainWindow = Electron.BrowserWindow;

    private windowTitle: string = "PhaserJS Worms Remake";
    private gameIcon = "../assets/gameIcon.png";

    private webPreferences = {
        devTools: true,
        nodeIntegration: true,
        // Read about multithreading, left false as default
        nodeIntegrationInWorker: false,
        plugins: false,
        zoomFactor: 1.0,
    };

    private WindowOptions = {
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

    static toggleFullscreen(): void {
        WindowManager.mainWindow.setFullscreen(!WindowManager.mainWindow.isFullscreen());
    }

    static ElectronIsRunning(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(" electron/") > -1) {
            return true;
        }
    }

    // Make keybind?
    static openDevTools(): void {
        WindowManager.mainWindow.webContents.openDevTools();
    }
}
