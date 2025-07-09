const { app, BrowserWindow, Menu, ipcMain, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
let mainWindow;
let authToken = store.get('authToken');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#FFFFFF'
  });

  // Carrega a aplicação
  if (process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
  }

  // Menu personalizado
  const template = [
    {
      label: 'OiPet',
      submenu: [
        { label: 'Sobre o OiPet', role: 'about' },
        { type: 'separator' },
        { label: 'Preferências', accelerator: 'Cmd+,', click: () => openPreferences() },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Cmd+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'Cmd+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'Shift+Cmd+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', accelerator: 'Cmd+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'Cmd+C', role: 'copy' },
        { label: 'Colar', accelerator: 'Cmd+V', role: 'paste' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { label: 'Recarregar', accelerator: 'Cmd+R', role: 'reload' },
        { label: 'Forçar Recarregamento', accelerator: 'Cmd+Shift+R', role: 'forceReload' },
        { type: 'separator' },
        { label: 'Tela Cheia', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Pets',
      submenu: [
        { label: 'Adicionar Pet', accelerator: 'Cmd+N', click: () => navigateTo('/pets/add') },
        { label: 'Meus Pets', accelerator: 'Cmd+P', click: () => navigateTo('/pets') },
        { type: 'separator' },
        { label: 'Registrar Alimentação', accelerator: 'Cmd+F', click: () => navigateTo('/feeding') }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        { label: 'Central de Ajuda', click: () => openExternalLink('https://oipet.com.br/ajuda') },
        { label: 'Reportar Problema', click: () => openExternalLink('https://oipet.com.br/suporte') }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function openPreferences() {
  // Abre janela de preferências
  const prefsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  prefsWindow.loadFile(path.join(__dirname, 'preferences.html'));
}

function navigateTo(route) {
  mainWindow.webContents.send('navigate', route);
}

function openExternalLink(url) {
  require('electron').shell.openExternal(url);
}

// IPC handlers
ipcMain.handle('get-auth-token', () => {
  return store.get('authToken');
});

ipcMain.handle('set-auth-token', (event, token) => {
  store.set('authToken', token);
  return true;
});

ipcMain.handle('clear-auth-token', () => {
  store.delete('authToken');
  return true;
});

ipcMain.handle('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

// App events
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});