try {
  require('electron-reloader')(module)
} catch (_) {}

const { app, BrowserWindow, Menu, Tray } = require('electron')
const ViGEmClient = require('vigemclient');
const { exec } = require('child_process');
const ioHook = require('iohook');
const path = require('path');

let client;
let controller;
let leftTimeout;
let isVisible;

let keys = []
let active = false
const arrows = [37, 38, 39, 40]
const result = () => keys.some(key => arrows.includes(key))

let window;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: 350,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  window = mainWindow

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.show();
    start()
  });

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  mainWindow.on('show', () => {
    isVisible = true
  })

  mainWindow.on('hide', () => {
    isVisible = false
  })
};

function start() {
  try {
    main()
  } catch (err) {
    onDriverNotFound()
  }
}

function print(a) {
  window.webContents.send('LOG_REQUEST', a);
}

function main() {
  client = new ViGEmClient()
  client.connect()
  controller = client.createX360Controller()
  controller.connect()

  ioHook.start()
  ioHook.on('keydown', function (event) {
    if (event.rawcode == 46) return onEnabled()
    if (event.rawcode == 35) return process.exit(0)
    if (!keys.includes(event.rawcode)) keys = [...keys, event.rawcode]
  })

  ioHook.on('keyup', function (event) {
    keys = keys.filter(e => e !== event.rawcode)
    if (!result()) handleMoveLeftPad(0, 0)
  })

  print("Ready")
}

function listen() {
  if (keys.includes(37)) handleMoveLeftPad(-1, 0) //left
  if (keys.includes(38)) handleMoveLeftPad(0, 1) //up
  if (keys.includes(39)) handleMoveLeftPad(1, 0) //right
  if (keys.includes(40)) handleMoveLeftPad(0, -1) //down
  if (keys.includes(38) && keys.includes(39)) handleMoveLeftPad(1, 1) //up+right
  if (keys.includes(38) && keys.includes(37)) handleMoveLeftPad(-1, 1) //upleft
  if (keys.includes(40) && keys.includes(39)) handleMoveLeftPad(1, -1) //downright
  if (keys.includes(40) && keys.includes(37)) handleMoveLeftPad(-1, -1) //downleft

  print(keys)

  leftTimeout = setTimeout(function () {
    listen();
  }, 100);
}

function handleMoveLeftPad(x, y) {
  controller.axis.leftX.setValue(x); // x-axis
  controller.axis.leftY.setValue(y); // y-axis
}

function onExit() {
  handleMoveLeftPad(0, 0)
  clearTimeout(leftTimeout)
}

function onEnabled() {
  active = !active
  window.webContents.send('STATUS_UPDATE', active);
  if (!active) return onExit()
  return listen()
}

const getExtraFilesPath = () => {
  var x = path.join(process.resourcesPath, '..')
  var y = path.join(x, '/extraResources')
  return y;
};

function onDriverNotFound() {
  print("Driver is not installed.")
  print("Installing driver.")

  exec(`cd ${getExtraFilesPath()} && msiexec /i ViGEmBusSetup_x64.msi /q /qn /norestart`, (error, stdout, stderr) => {
    if (error) print(error)
    if (stdout) print(stdout)
    if (stderr) print(stderr)
  }).on('exit', code => {
    print('final exit code is', code)
    main()
  })
}

function willQuit() {
  clearTimeout(leftTimeout)
  ioHook.stop()
}

app.on('ready', () => createWindow())
app.on('window-all-closed', () => app.quit())
app.on('will-quit', () => willQuit())
app.whenReady().then(() => {
  const iconPath = path.join(__dirname, 'build', 'icon.ico')
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show', click: () => {
        window.show();
      },
    }, {
      label: 'Exit', click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Gamepad Emulator');
  tray.setContextMenu(contextMenu);
  tray.on('right-click', () => tray.popUpContextMenu())
  tray.on('click', () => window.show());
});