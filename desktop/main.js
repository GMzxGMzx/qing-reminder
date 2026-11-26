const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen } = require('electron');
const path = require('path');

let win = null;
let tray = null;
let preAlertPos = null;

const SIZES = {
  compact: { width: 360, height: 330 },
  expanded: { width: 780, height: 580 },
  alert: { width: 520, height: 370 }
};

function createWindow() {
  win = new BrowserWindow({
    width: SIZES.compact.width,
    height: SIZES.compact.height,
    minWidth: 280,
    minHeight: 160,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  const area = screen.getPrimaryDisplay().workAreaSize;
  win.setPosition(
    Math.max(0, area.width - SIZES.compact.width - 28),
    Math.max(0, area.height - SIZES.compact.height - 42)
  );

  win.on('closed', () => { win = null; });
}

function setMode(mode) {
  if (!win) return;
  const size = SIZES[mode] || SIZES.compact;
  const area = screen.getPrimaryDisplay().workAreaSize;

  if (mode === 'alert') {
    if (!preAlertPos) preAlertPos = win.getPosition();
    win.setResizable(true);
    win.setSize(size.width, size.height);
    win.setResizable(false);
    win.setPosition(
      Math.max(0, Math.round((area.width - size.width) / 2)),
      Math.max(0, Math.round((area.height - size.height) / 2))
    );
    win.show();
    win.focus();
    return;
  }

  win.setResizable(true);
  win.setSize(size.width, size.height);
  win.setResizable(false);
  if (preAlertPos) {
    win.setPosition(preAlertPos[0], preAlertPos[1]);
    preAlertPos = null;
  } else {
    const pos = win.getPosition();
    win.setPosition(
      Math.max(0, Math.min(pos[0], area.width - size.width - 8)),
      Math.max(0, Math.min(pos[1], area.height - size.height - 8))
    );
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('set-mode', (event, mode) => setMode(mode));

ipcMain.on('set-opacity', (event, value) => {
  if (win) win.setOpacity(Math.min(1, Math.max(0.25, Number(value))));
});

ipcMain.on('set-always-on-top', (event, value) => {
  if (win) win.setAlwaysOnTop(!!value);
});

ipcMain.on('hide-window', () => {
  if (win) win.hide();
});

ipcMain.on('quit-app', () => {
  app.quit();
});

ipcMain.on('register-tray', (event, dataUrl) => {
  if (tray) return;
  try {
    tray = new Tray(nativeImage.createFromDataURL(dataUrl));
  } catch (e) {
    return;
  }
  tray.setToolTip('轻提醒');
  const menu = Menu.buildFromTemplate([
    {
      label: '显示 / 隐藏',
      click: () => {
        if (!win) return;
        if (win.isVisible()) win.hide(); else { win.show(); win.focus(); }
      }
    },
    {
      label: '置顶窗口',
      type: 'checkbox',
      checked: true,
      click: (item) => { if (win) win.setAlwaysOnTop(item.checked); }
    },
    { type: 'separator' },
    { label: '退出轻提醒', click: () => app.quit() }
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => {
    if (!win) return;
    if (win.isVisible()) win.hide(); else { win.show(); win.focus(); }
  });
});
