import {BrowserWindow} from 'electron';

export default class Window {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;
    static WindowOptions;
 
    private static createWindow(): void {
        Window.mainWindow = new Window.BrowserWindow(
            Window.WindowOptions
        );

        Window.mainWindow.loadURL(`http://127.0.0.1:1337/elec`);
        Window.mainWindow.setMenu(null);
        Window.mainWindow.on('closed',
            Window.onClose
        );
    }

    private static onReady(): void {
        Window.createWindow();
    }

    private static onActivate(): void {
        if (Window.mainWindow == null) {
            Window.createWindow();
        }
    }

    private static onWindowAllClosed(): void {
        if (process.platform !== 'darwin') {
            Window.application.quit();
        }
    }

    private static onClose(): void {
        Window.mainWindow = null;
    }

    static init (
        app: Electron.App,
        browserWindow: typeof BrowserWindow,
        windowoptions: any): void {
        // we pass the Electron.App object and the 
        // Electron.BrowserWindow into this function
        // so this class has no dependencies.
        // this makes the code easier to write tests for.
        Window.WindowOptions = windowoptions;
        Window.BrowserWindow = browserWindow;
        Window.application = app;
        Window.application.on('window-all-closed',
            Window.onWindowAllClosed);
        Window.application.on('ready', 
            Window.onReady);
        Window.application.on('activate', 
            Window.onActivate);
    }
}