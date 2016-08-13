
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

import terminal = require('./service/terminal')
 
terminal(8004)
var mainWindow = null

app.on('window-all-closed', function() { 
    if (process.platform != 'darwin') {
        app.quit()
    }
}) 
declare var $dirname

app.on('ready', function() 
{
    mainWindow = new BrowserWindow({width: 800, height: 600});
    console.log('file://' + __dirname + '/public/index.html')
    mainWindow.loadURL('file://' + __dirname + '/../public/index.html')
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })
})


declare function require(name:string);