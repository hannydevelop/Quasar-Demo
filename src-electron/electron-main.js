import { app, BrowserWindow } from 'electron'
import path from 'path'
import os from 'os'
import log from 'electron-log';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()
// this should work in production.
// const serverPath = path.resolve(__dirname, 'node_modules/peppubuild/index.js');
// this will work in dev.
const serverPath = path.resolve('node_modules/peppubuild/index.js');
const { fork } = require("child_process");

let mainWindow

let startOfflineServer = () => {
  console.log(serverPath)
    const child = fork(serverPath, [], {
     
      env:{
        ...process.env,
        PORT:1404
      }
    });
    child.on('error', (err) => {
      log.info("\n\t\tERROR: spawn failed! (" + err + ")");
    });
   
    child.on('data', function(data) {
      log.info('stdout: ' +data);
    });
   
    child.on('exit', (code, signal) => {
      log.info('exit code : ',code);
      log.info('exit signal : ',signal);
      
    });
   
    child.unref();
  
    //on parent process exit, terminate child process too.
    process.on('exit',function(){
      child.kill()
    })
}



function createWindow () {
  startOfflineServer()
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
