export class WindowManager {
    // Our Electron instance
    public mainWindow;

    public windowTitle: string = "PhaserJS Worms Remake";
    public gameIcon = "../assets/gameIcon.png";

    public webPreferences = {
        devTools: true,
        nodeIntegration: true,
        // Read about multithreading, left false as default
        nodeIntegrationInWorker: false,
        plugins: false,
        zoomFactor: 1.0,
    };

    public WindowOptions = {
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
