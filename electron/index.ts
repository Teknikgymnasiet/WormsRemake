import { app, BrowserWindow } from 'electron';
import gameWindow from './gameWindow';

gameWindow.init(app, BrowserWindow);
