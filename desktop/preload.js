const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Auth
  getAuthToken: () => ipcRenderer.invoke('get-auth-token'),
  setAuthToken: (token) => ipcRenderer.invoke('set-auth-token', token),
  clearAuthToken: () => ipcRenderer.invoke('clear-auth-token'),
  
  // Notifications
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  
  // Navigation
  onNavigate: (callback) => {
    ipcRenderer.on('navigate', (event, route) => callback(route));
  },
  
  // Platform info
  platform: process.platform
});