import { app, BrowserWindow, screen, ipcMain, IpcMessageEvent, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { fromEvent } from 'rxjs';


type Test<T> = [IpcMessageEvent, T];

fromEvent<Test<[string, number, string]>>(ipcMain, 'show-open-dialog').subscribe(a => {
  const channel = a[0];

  dialog.showOpenDialog({}, (evt) => {
    channel.sender.send('response', evt);
  });
});


let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  win = new BrowserWindow({
    center: true,
    width: 1024,
    minWidth: 600,
    height: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false
    }
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
