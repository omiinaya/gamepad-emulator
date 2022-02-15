const VGen = require("vgen-xbox")
const ioHook = require('iohook');
const _vgen = new VGen();

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
let rightTimeout;

function main() {
    console.log("Ready");
    ioHook.start();
    ioHook.on('keydown', function (event) {
        if (event.rawcode != 46) return
        active = !active
        Listener()
    })
    //rLeft(0);
    //rRight(0);
    //buttons(0);
    //dpad(0);
}

function Listener() {
    if (active) return clearTimeout(rightTimeout)
    rRight(0)
}

function rRight(x) {
    let test = [Math.sin(x), Math.cos(x)]
    _vgen.setAxisR(1, test[0], test[1]);
    //_vgen.setAxisR(1, 1, 0.0);

    rightTimeout = setTimeout(function () {
        rRight(x + 0.1);
        console.log(active)
    }, 100);
}

function rLeft(x) {
    _vgen.setAxisL(1, Math.sin(x), Math.cos(x));

    setTimeout(function () {
        rLeft(x + 0.1);
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