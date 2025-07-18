/**
 * Platform detection utilities for handling Electron vs Web deployment differences
 */

// Type definitions for Electron-specific globals
interface ElectronWindow {
  electronAPI?: unknown;
  process?: {
    type?: string;
    [key: string]: unknown;
  };
  require?: unknown;
}

// Environment detection
export const isElectron = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side: check environment variable
    return process.env.IS_ELECTRON === 'true' || process.env.DEPLOYMENT_TARGET === 'electron';
  }

  // Client-side: check for electron-specific globals
  const electronWindow = window as unknown as ElectronWindow;
  return (
    !!electronWindow.electronAPI || !!electronWindow.process?.type || typeof electronWindow.require !== 'undefined'
  );
};

export const isWeb = (): boolean => {
  return !isElectron();
};

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

// Platform-specific feature detection
export const supportsFileSystemAccess = (): boolean => {
  if (isServer()) return false;

  // Check if we're in Electron (has full file system access)
  if (isElectron()) return true;

  // Check if browser supports File System Access API
  return 'showOpenFilePicker' in window;
};

export const supportsNativeNotifications = (): boolean => {
  if (isServer()) return false;

  // Electron always supports notifications
  if (isElectron()) return true;

  // Check browser notification support
  return 'Notification' in window;
};

// Platform-specific configuration
export const getPlatformConfig = () => {
  return {
    isElectron: isElectron(),
    isWeb: isWeb(),
    isBrowser: isBrowser(),
    isServer: isServer(),
    supportsFileSystemAccess: supportsFileSystemAccess(),
    supportsNativeNotifications: supportsNativeNotifications(),
    // Add more platform-specific features as needed
  };
};

// Platform-specific styling
export const getPlatformStyles = () => {
  if (isElectron()) {
    return {
      // Electron-specific styles
      windowDragRegion: 'drag',
      titleBarHeight: '30px',
      borderRadius: '8px',
    };
  }

  return {
    // Web-specific styles
    windowDragRegion: 'auto',
    titleBarHeight: '0px',
    borderRadius: '0px',
  };
};

// Development utilities
export const logPlatformInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Platform Detection:', getPlatformConfig());
  }
};
