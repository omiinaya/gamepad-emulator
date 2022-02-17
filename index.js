const VGen = require("vgen-xbox")
const ioHook = require('iohook');
const _vgen = new VGen()

let keys = []

try {
    // Try plugging in first controller
    _vgen.plugin(1);
    main();
}
catch (e) {
    // Exception most probably due to drivers not installed
    _vgen.installDriver(() => {
        _vgen.plugin(1);
        main();
    });
}

let active = true;
let leftTimeout;

function main() {
    console.log("Ready")
    ioHook.start();
    ioHook.on('keydown', function (event) {
        //add keys to key array on down
        if (event.rawcode == 46) {
            active = !active
            Listener()
        } else if (event.rawcode == 37) { //left
            if (!keys.includes(event.rawcode)) {
                keys = [...keys, event.rawcode]
                console.log(keys)
            }
        } else if (event.rawcode == 38) { //up
            if (!keys.includes(event.rawcode)) {
                keys = [...keys, event.rawcode]
                console.log(keys)
            }
        } else if (event.rawcode == 39) { //right
            if (!keys.includes(event.rawcode)) {
                keys = [...keys, event.rawcode]
                console.log(keys)
            }
        } else if (event.rawcode == 40) { //down
            if (!keys.includes(event.rawcode)) {
                keys = [...keys, event.rawcode]
                console.log(keys)
            }
        } else if (event.rawcode == 35) { //end
            process.exit(0)
        }
    })
    ioHook.on('keyup', function (event) {
        //removes keys from array on keyup
        var newKeys = keys.filter(e => e !== event.rawcode)
        keys = newKeys
        if (keys.length === 0) {
            _vgen.setAxisL(1, 0.0, 0.0)
        }
        //console.log(newKeys)
    })
}

function Listener() {
    if (active) {
        clearTimeout(leftTimeout)
        //_vgen.setAxisL(1, 0.0, 0.0)
    } else {
        rLeft()
    }
}

function rLeft() {
    console.log(keys)
    //analog
    if (keys.length === 1 && keys[0] === 37) _vgen.setAxisL(1, -1.0, 0.0) //left
    if (keys.length === 1 && keys[0] === 38) _vgen.setAxisL(1, 0.0, 1.0) //up
    if (keys.length === 1 && keys[0] === 39) _vgen.setAxisL(1, 1.0, 0.0) //right
    if (keys.length === 1 && keys[0] === 40) _vgen.setAxisL(1, 0.0, -1.0) //down
    //diagonal
    if (keys.includes(38) && keys.includes(39)) _vgen.setAxisL(1, 1.0, 1.0) //up+right
    if (keys.includes(38) && keys.includes(37)) _vgen.setAxisL(1, -1.0, 1.0) //upleft
    if (keys.includes(40) && keys.includes(39)) _vgen.setAxisL(1, 1.0, -1.0) //downright
    if (keys.includes(40) && keys.includes(37)) _vgen.setAxisL(1, -1.0, -1.0) //downleft
    
    leftTimeout = setTimeout(function () {
        rLeft();
    }, 100);
}
/*
function rRight(x) {
    let test = [Math.sin(x), Math.cos(x)]
    _vgen.setAxisR(1, test[0], test[1]);
    //_vgen.setAxisR(1, 1, 0.0);

    rightTimeout = setTimeout(function () {
        rRight(x + 0.1);
        console.log(active)
    }, 100);
}

function dpad(x) {
    var arr = [];
    arr[0] = _vgen.Dpad.NONE;
    arr[1] = _vgen.Dpad.UP;
    arr[2] = _vgen.Dpad.UP_RIGHT;
    arr[3] = _vgen.Dpad.RIGHT;
    arr[4] = _vgen.Dpad.DOWN_RIGHT;
    arr[5] = _vgen.Dpad.DOWN;
    arr[6] = _vgen.Dpad.DOWN_LEFT;
    arr[7] = _vgen.Dpad.LEFT;
    arr[8] = _vgen.Dpad.UP_LEFT;
    arr[9] = _vgen.Dpad.UP;

    _vgen.setDpad(1, arr[x]);

    setTimeout(function () {
        dpad((x + 1) % arr.length);
    }, 250);
}

function buttons(x) {
    var arr = [];
    arr[0] = _vgen.Buttons.A;
    arr[1] = _vgen.Buttons.B;
    arr[2] = _vgen.Buttons.X;
    arr[3] = _vgen.Buttons.Y;
    arr[4] = _vgen.Buttons.LEFT_SHOULDER;
    arr[5] = _vgen.Buttons.RIGHT_SHOULDER;
    arr[6] = _vgen.Buttons.BACK;
    arr[7] = _vgen.Buttons.START;
    arr[8] = _vgen.Buttons.LEFT_THUMB;
    arr[9] = _vgen.Buttons.RIGHT_THUMB;

    _vgen.setButton(1, arr[0] | arr[1]
        | arr[2] | arr[3]
        | arr[4] | arr[5]
        | arr[6] | arr[7]
        | arr[8] | arr[9], false);
    _vgen.setButton(1, arr[x], true);

    setTimeout(function () {
        buttons((x + 1) % arr.length);
    }, 250);
}
*/