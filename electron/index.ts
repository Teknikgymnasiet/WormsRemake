import { app, BrowserWindow } from 'electron';
import Window from './Window';
let WindowOptions = require('./WindowOptions.json');

Window.init(app, BrowserWindow, WindowOptions);
