const { app } = require('electron')
const ViGEmClient = require('vigemclient');
const ioHook = require('iohook');
const exec = require('@mh-cbon/aghfabsowecwn').exec

let client;
let controller;
let active = false
let keys = [] //array of keys currently being held
let leftTimeout //stores keys held
let result = keys.some(i => [37, 38, 39, 40].includes(i)); //check if arrow keys are being pressed or not.

function Init() {
  client = new ViGEmClient()
  client.connect()
  controller = client.createX360Controller()
  controller.connect()
}

function Main() {
  ioHook.start()
  ioHook.on('keydown', function (event) {
    if (event.rawcode == 46) return onStart()
    if (event.rawcode == 35) return process.exit(0)
    if (!keys.includes(event.rawcode)) keys = [...keys, event.rawcode]
  })

  ioHook.on('keyup', function (event) {
    keys = keys.filter(e => e !== event.rawcode)
    if (!result) handleMoveLeftPad(0, 0) //reset pos if not pressing any keys
  })
  console.log("Ready")
}

function Listener() {
  console.log(keys)
  if (keys.includes(37)) handleMoveLeftPad(-1, 0) //left
  if (keys.includes(38)) handleMoveLeftPad(0, 1) //up
  if (keys.includes(39)) handleMoveLeftPad(1, 0) //right
  if (keys.includes(40)) handleMoveLeftPad(0, -1) //down
  if (keys.includes(38) && keys.includes(39)) handleMoveLeftPad(1, 1) //up+right
  if (keys.includes(38) && keys.includes(37)) handleMoveLeftPad(-1, 1) //upleft
  if (keys.includes(40) && keys.includes(39)) handleMoveLeftPad(1, -1) //downright
  if (keys.includes(40) && keys.includes(37)) handleMoveLeftPad(-1, -1) //downleft

  leftTimeout = setTimeout(function () {
    Listener();
  }, 100);
}

function handleMoveLeftPad(x, y) {
  controller.axis.leftX.setValue(x); // x-axis
  controller.axis.leftY.setValue(y); // y-axis
}

function onExit() {
  clearTimeout(leftTimeout)
  handleMoveLeftPad(0, 0)
}

function onStart() {
  active = !active
  if (!active) return onExit()
  return Listener()
}

function onDriverNotFound() {
  console.log("Driver is not installed.")
  console.log("Installing driver.")

  let child = exec('msiexec /i ViGEmBusSetup_x64.msi /q /qn /norestart', { cwd: './drivers' })

  child.on('exit', function (code) {
    console.log(code)
    Init()
    Main()
  });

  child.on('error', function (error) {
    console.log('===> child error=%s', error)
    console.log('===> child error=%j', error)
    if (error.code === 'ECONNREFUSED') console.log('UAC was probably not validated.')
  })
}

app.on('ready', () => {
  try {
    Init()
    Main()
  } catch (err) {
    console.log(err)
    onDriverNotFound()
  }
});