const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(
      `require('./src/electron-components/renderer.js');`
    );
  });
});

ipcMain.on('updateChartData', (event, chartData) => {
console.log("");
});
