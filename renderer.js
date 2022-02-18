const electron = require('electron')
const ipc = electron.ipcRenderer

ipc.on('LOG_REQUEST', (evt, data) => {
    console.log(data)
})