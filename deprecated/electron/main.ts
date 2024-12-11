const { app, BrowserWindow } = require('electron')
//import {app, BrowserWindow} from 'electron'
console.log(114514)
//const pwd = process.pwd()
const indexPath = 'D:/_code/voca/out/frontend/dist/index.html'
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile(indexPath)
}

app.whenReady().then(() => {
  createWindow()
})

