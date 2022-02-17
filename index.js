const ViGEmClient = require('vigemclient');
const ioHook = require('iohook');

let client = new ViGEmClient();
client.connect(); // establish connection to the ViGEmBus driver
let controller = client.createX360Controller();
controller.connect(); // plug in the virtual controller

let keys = [] //stores keys held
let active = true;
let leftTimeout;

main()

function main() {
    console.log("Ready")
    ioHook.start()
    ioHook.on('keydown', function (event) {
        //add keys to key array on down
        if (event.rawcode == 46) {
            active = !active
            Listener()
        }

        if (event.rawcode == 35) { //end
            process.exit(0)
        }

        if (!keys.includes(event.rawcode)) {
            keys = [...keys, event.rawcode]
            console.log(keys)
        }
    })

    ioHook.on('keyup', function (event) {
        //removes keys from array on keyup
        var newKeys = keys.filter(e => e !== event.rawcode)
        keys = newKeys
        //reset pos if no keys are held
        if (keys.length === 0) {
            handleMoveLeftPad(0, 0)
        }
    })
}

function Listener() {
    if (active) {
        clearTimeout(leftTimeout)
        handleMoveLeftPad(0, 0)
    } else {
        rLeft()
    }
}

function rLeft() {
    console.log(keys)
    //analog
    if (keys.includes(37)) handleMoveLeftPad(-1, 0) //left
    if (keys.includes(38)) handleMoveLeftPad(0, 1) //up
    if (keys.includes(39)) handleMoveLeftPad(1, 0) //right
    if (keys.includes(40)) handleMoveLeftPad(0, -1) //down

    //diagonal
    if (keys.includes(38) && keys.includes(39)) handleMoveLeftPad(1, 1) //up+right
    if (keys.includes(38) && keys.includes(37)) handleMoveLeftPad(-1, 1) //upleft
    if (keys.includes(40) && keys.includes(39)) handleMoveLeftPad(1, -1) //downright
    if (keys.includes(40) && keys.includes(37)) handleMoveLeftPad(-1, -1) //downleft

    leftTimeout = setTimeout(function () {
        rLeft();
    }, 100);
}

function handleMoveLeftPad(x, y) {
    controller.axis.leftX.setValue(x); // x-axis
    controller.axis.leftY.setValue(y); // y-axis
}

/*
// change some axes and buttons
controller.axis.leftX.setValue(0.5); // move left stick 50% to the left
controller.axis.leftY.setValue(-0.5); // move left stick 50% down
controller.axis.leftTrigger.setValue(1); // press in left trigger all the way

controller.button.Y.setValue(true); // press Y button
*/