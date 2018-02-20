

export class WindowManager {
    public gameWindow;
    private mainWindow = this.gameWindow;

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
}