import {BrowserWindow} from 'electron';

export default class gameWindow {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    private windowTitle: string = "PhaserJS Worms Remake";
    private gameIcon: string = "../assets/gameIcon.png";

    private webPreferences = {
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
 
    private static createWindow(): void {
        gameWindow.mainWindow = new gameWindow.BrowserWindow(
            gameWindow.prototype.WindowOptions
        );

        gameWindow.mainWindow.loadURL(`http://127.0.0.1:1337/elec`);
        gameWindow.mainWindow.setMenu(null);
        gameWindow.mainWindow.on('closed',
            gameWindow.onClose
        );
    }

    private static onReady(): void {
        gameWindow.createWindow;
    }

    private static onActivate(): void {
        if (gameWindow.mainWindow == null) {
            gameWindow.createWindow();
        }
    }

    private static onWindowAllClosed(): void {
        if (process.platform !== 'darwin') {
            gameWindow.application.quit();
        }
    }

    private static onClose(): void {
        gameWindow.mainWindow = null;
    }

    static init (
        app: Electron.App,
        browserWindow: typeof BrowserWindow): void {
        // we pass the Electron.App object and the 
        // Electron.BrowserWindow into this function
        // so this class has no dependencies.
        // this makes the code easier to write tests for.

        gameWindow.BrowserWindow = browserWindow;
        gameWindow.application = app;
        gameWindow.application.on('window-all-closed',
            gameWindow.onWindowAllClosed);
        gameWindow.application.on('ready', 
            gameWindow.onReady);
        gameWindow.application.on('activate', 
            gameWindow.onActivate);
    }
}