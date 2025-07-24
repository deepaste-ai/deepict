import { is } from '@electron-toolkit/utils';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { getPort } from 'get-port-please';
import { startServer } from 'next/dist/server/lib/start-server';
import { join } from 'path';

// Constants
const WINDOW_CONFIG = {
  WIDTH_SCALE: 0.8,
  HEIGHT_SCALE: 0.8,
  MIN_WIDTH: 800,
  MIN_HEIGHT: 600,
} as const;

const NEXTJS_SERVER_CONFIG = {
  PORT_RANGE: [30_011, 50_000] as [number, number],
  KEEP_ALIVE_TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Types
interface NextJSServerInfo {
  port: number;
  isRunning: boolean;
}

// Global variables
let nextJSServerInfo: NextJSServerInfo | null = null;
let mainWindow: BrowserWindow | null = null;

/**
 * Get default window size based on screen dimensions
 */
const getDefaultWindowSize = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return {
    width: Math.max(Math.floor(width * WINDOW_CONFIG.WIDTH_SCALE), WINDOW_CONFIG.MIN_WIDTH),
    height: Math.max(Math.floor(height * WINDOW_CONFIG.HEIGHT_SCALE), WINDOW_CONFIG.MIN_HEIGHT),
  };
};

/**
 * Ensure Next.js server is running with retry logic
 */
const ensureNextJSServer = async (): Promise<number> => {
  if (nextJSServerInfo?.isRunning) {
    console.log('Next.js server already running on port:', nextJSServerInfo.port);
    return nextJSServerInfo.port;
  }

  for (let attempt = 1; attempt <= NEXTJS_SERVER_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      const nextJSPort = await getPort({
        portRange: NEXTJS_SERVER_CONFIG.PORT_RANGE,
      });
      const webDir = join(app.getAppPath(), 'app');

      console.log(`Starting Next.js server on port: ${nextJSPort} (attempt ${attempt})`);

      await startServer({
        dir: webDir,
        isDev: false,
        hostname: 'localhost',
        port: nextJSPort,
        customServer: true,
        allowRetry: false,
        keepAliveTimeout: NEXTJS_SERVER_CONFIG.KEEP_ALIVE_TIMEOUT,
        minimalMode: true,
      });

      console.log('Next.js server started successfully on port:', nextJSPort);

      nextJSServerInfo = { port: nextJSPort, isRunning: true };
      return nextJSPort;
    } catch (error) {
      console.error(`Error starting Next.js server (attempt ${attempt}):`, error);

      if (attempt === NEXTJS_SERVER_CONFIG.RETRY_ATTEMPTS) {
        nextJSServerInfo = null;
        throw new Error(`Failed to start Next.js server after ${NEXTJS_SERVER_CONFIG.RETRY_ATTEMPTS} attempts`);
      }

      await new Promise((resolve) => setTimeout(resolve, NEXTJS_SERVER_CONFIG.RETRY_DELAY * attempt));
    }
  }

  throw new Error('Unexpected error in ensureNextJSServer');
};

/**
 * Create main window
 */
const createWindow = async (): Promise<BrowserWindow> => {
  const { width, height } = getDefaultWindowSize();

  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: WINDOW_CONFIG.MIN_WIDTH,
    minHeight: WINDOW_CONFIG.MIN_HEIGHT,
    icon: is.dev ? join(__dirname, '../build-assets/icon.png') : join(process.resourcesPath, 'build-assets/icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    show: false,
  });

  // Set up event listeners first
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Load URL after setting up listeners
  try {
    if (is.dev) {
      await mainWindow.loadURL('http://localhost:3000');
    } else {
      const port = await ensureNextJSServer();
      await mainWindow.loadURL(`http://localhost:${port}`);
    }
  } catch (error) {
    console.error('Error loading window URL:', error);
    await mainWindow.loadURL('data:text/html,<h1>Server Error</h1><p>Unable to start the Next.js server.</p>');
  }

  return mainWindow;
};

// App event handlers
app.whenReady().then(async () => {
  try {
    await createWindow();
    console.log('Application started successfully');
  } catch (error) {
    console.error('Error creating window:', error);
  }

  // IPC handling
  ipcMain.on('ping', () => console.log('pong'));

  // Activate event handling
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      try {
        await createWindow();
      } catch (error) {
        console.error('Error creating window on activate:', error);
      }
    }
  });
});

// All windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nextJSServerInfo) {
      console.log('Cleaning up Next.js server');
      nextJSServerInfo.isRunning = false;
      nextJSServerInfo = null;
    }
    app.quit();
  }
});

// Cleanup before quit
app.on('before-quit', () => {
  if (nextJSServerInfo) {
    nextJSServerInfo.isRunning = false;
    nextJSServerInfo = null;
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (nextJSServerInfo) {
    nextJSServerInfo.isRunning = false;
    nextJSServerInfo = null;
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
