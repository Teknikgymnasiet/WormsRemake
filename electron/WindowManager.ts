

export class WindowManager {
    // Our Electron instance
    private mainWindow;
    // Referance Boundle.js window inside our electronwindow
    public gameWindow;

    public windowTitle:string = "PhaserJS Worms Remake";
    public gameIcon = '../assets/gameIcon.png';
    
    protected webPreferences = {
        devTools: true,
        nodeIntegration: true,
        // Read about multithreading, left false as default
        nodeIntegrationInWorker: false,
        zoomFactor: 1.0,
        plugins: false
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


    public toggleFullscreen():void {
        this.mainWindow.setFullscreen( !this.mainWindow.isFullscreen() );
    }

    public ElectronIsRunning():boolean {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(' electron/') > -1) {
           return true;
        }
    }

    // Make keybind?
    public openDevTools():void {
        this.mainWindow.webContents.openDevTools();
    }
}