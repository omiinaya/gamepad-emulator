const ViGEmClient = require('vigemclient');
const ioHook = require('iohook');

let client = new ViGEmClient()
client.connect()
let controller = client.createX360Controller()
controller.connect()

let active = false
let keys = [] //array of keys currently being held
let leftTimeout //stores keys held
let result = keys.some(i => [37, 38, 39, 40].includes(i)); //check if arrow keys are being pressed or not.

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
    Listener()
}

/*
// change some axes and buttons
controller.axis.leftX.setValue(0.5); // move left stick 50% to the left
controller.axis.leftY.setValue(-0.5); // move left stick 50% down
controller.axis.leftTrigger.setValue(1); // press in left trigger all the way

controller.button.Y.setValue(true); // press Y button
*/