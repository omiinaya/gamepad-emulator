const electron = require('electron')
const ipc = electron.ipcRenderer
const MouseMovement = require('mouse-movement')

const mouseMovement = new MouseMovement();
mouseMovement.init({mousemoveCallback: mouseMovementCallback});
function mouseMovementCallback() {
  console.log(mouseMovement.directionX);
  console.log(mouseMovement.speedX);
  console.log(mouseMovement.directionY);
  console.log(mouseMovement.speedY);
  console.log(mouseMovement.diagonal);
}

const disabled = (`
    <div id="status" class="alert alert-danger" role="alert">
      STATUS: Disabled
    </div>
`)

const enabled = (`
    <div id="status" class="alert alert-success" role="alert">
        STATUS: Enabled
    </div>
`)

ipc.on('LOG_REQUEST', (evt, data) => {
    console.log(data)
})

ipc.on('STATUS_UPDATE', (evt, data) => {
    const status = data
    const el = document.getElementById('status')
    if (status) return el.outerHTML = enabled
    return el.outerHTML = disabled
})