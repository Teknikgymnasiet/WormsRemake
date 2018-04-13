import {BrowserWindow} from 'electron';

export default class WindowManager {
    static mainWindow: Electron.BrowserWindow;

    constructor(mainWindow: any) {
        WindowManager.mainWindow = mainWindow;
    }

    static toggleFullscreen(): void {
        WindowManager.mainWindow.setFullScreen(!WindowManager.mainWindow.isFullScreen());
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
