# Electron Directory

This directory contains the Electron desktop application implementation for Deepict, providing the native desktop runtime environment.

## Architecture Overview

Deepict uses Electron's dual-process architecture to create a secure, performant desktop application:

- **Main Process**: Node.js runtime managing app lifecycle and window creation
- **Renderer Process**: Chromium browser running the Next.js application
- **Preload Script**: Secure bridge between main and renderer processes

## Main Process (`main.ts`)

### Overview
The main process serves as the application controller, managing the desktop environment and coordinating between system resources and the web-based UI.

### Core Responsibilities

#### Application Lifecycle Management
- **App Initialization**: Handle app startup and ready events
- **Window Management**: Create and manage browser windows
- **Process Coordination**: Manage renderer processes
- **Shutdown Handling**: Clean shutdown and resource cleanup

#### Next.js Server Integration
- **Development Mode**: Connect to dev server (localhost:3000)
- **Production Mode**: Start standalone Next.js server
- **Port Management**: Dynamic port allocation (30,011-50,000)
- **Server Health**: Monitor server status and retry logic

### Configuration Constants

#### Window Configuration
```typescript
const WINDOW_CONFIG = {
  WIDTH_SCALE: 0.8,      // 80% of screen width
  HEIGHT_SCALE: 0.8,     // 80% of screen height
  MIN_WIDTH: 800,        // Minimum window width
  MIN_HEIGHT: 600,       // Minimum window height
}
```

#### Server Configuration
```typescript
const NEXTJS_SERVER_CONFIG = {
  PORT_RANGE: [30_011, 50_000],  // Available port range
  KEEP_ALIVE_TIMEOUT: 5000,      // Connection timeout
  RETRY_ATTEMPTS: 3,             // Server start retry attempts
  RETRY_DELAY: 1000,             // Delay between retries
}
```

### Window Management

#### Dynamic Window Sizing
```typescript
const getDefaultWindowSize = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  return {
    width: Math.max(Math.floor(width * 0.8), 800),
    height: Math.max(Math.floor(height * 0.8), 600),
  };
};
```

#### Window Configuration
- **Responsive Sizing**: Adapts to screen size
- **Minimum Constraints**: Ensures usable interface
- **Icon Management**: Platform-specific icon handling
- **Security**: Secure preload script integration

### Next.js Server Management

#### Production Server Startup
```typescript
const ensureNextJSServer = async (): Promise<number> => {
  // Port allocation
  const nextJSPort = await getPort({
    portRange: [30_011, 50_000],
  });
  
  // Server startup
  await startServer({
    dir: webDir,
    isDev: false,
    hostname: "localhost",
    port: nextJSPort,
    customServer: true,
    allowRetry: false,
    keepAliveTimeout: 5000,
    minimalMode: true,
  });
};
```

#### Development vs Production
- **Development**: Connects to existing dev server
- **Production**: Starts embedded Next.js server
- **Port Management**: Dynamic port allocation
- **Health Monitoring**: Server status tracking

### Error Handling

#### Server Startup Errors
- **Retry Logic**: Multiple startup attempts
- **Port Conflicts**: Dynamic port allocation
- **Graceful Degradation**: Fallback error page
- **User Feedback**: Clear error messages

#### Window Management Errors
- **Creation Failures**: Fallback window creation
- **Loading Errors**: Error page display
- **Resource Cleanup**: Proper resource disposal

### IPC Communication

#### IPC Handler Setup
```typescript
ipcMain.on("ping", () => console.log("pong"));
```

#### Security Considerations
- **Secure Preload**: Controlled API exposure
- **Input Validation**: Sanitize IPC messages
- **Permission Management**: Restricted system access

### Platform Integration

#### macOS Integration
- **Dock Behavior**: Proper dock icon handling
- **App Menu**: Native menu integration
- **Window Behavior**: macOS-specific window management

#### Windows Integration
- **Taskbar**: Windows taskbar integration
- **Window Controls**: Native window controls
- **File Associations**: File type handling

#### Linux Integration
- **Desktop Environment**: DE-specific integration
- **File Manager**: File system integration
- **Package Management**: Distribution packages

## Preload Script (`preload.ts`)

### Overview
The preload script provides a secure bridge between the main and renderer processes, exposing only necessary APIs while maintaining security.

### Security Model
- **Context Isolation**: Separate execution contexts
- **Limited API Exposure**: Only required APIs exposed
- **Input Validation**: Sanitize all communications
- **Sandboxing**: Restricted system access

### API Exposure Pattern
```typescript
// Secure API exposure
contextBridge.exposeInMainWorld('electronAPI', {
  // Safe methods only
  getVersion: () => process.version,
  platform: process.platform,
});
```

## Build Configuration

### TypeScript Configuration
- **Target**: ES2022 for modern features
- **Module System**: ESNext with bundler resolution
- **Strict Mode**: Full TypeScript strict mode
- **Path Mapping**: Absolute imports support

### Build Process
1. **TypeScript Compilation**: Source to JavaScript
2. **Asset Bundling**: Static asset handling
3. **Dependency Resolution**: Node.js modules
4. **Output Optimization**: Production optimization

### Distribution Packaging
- **Code Signing**: Digital signature for security
- **Auto-updater**: Automatic update mechanism
- **Platform Packages**: Platform-specific installers
- **Asset Optimization**: Minimize bundle size

## Development Workflow

### Local Development
```bash
# Start Electron development
pnpm electron:dev

# Build Electron main process
pnpm electron:build

# Watch mode for development
pnpm electron:build_watch
```

### Production Build
```bash
# Build everything
pnpm build

# Create distribution
pnpm dist

# Platform-specific builds
pnpm dist:nsis  # Windows
pnpm dist:deb   # Linux
```

## Security Considerations

### Process Isolation
- **Sandboxed Renderer**: Limited system access
- **Secure IPC**: Validated communication
- **Node.js Isolation**: Controlled Node.js access
- **Context Isolation**: Separate execution contexts

### Resource Protection
- **File System Access**: Controlled file operations
- **Network Access**: Validated network requests
- **System Integration**: Limited system APIs
- **User Data**: Secure data handling

## Performance Optimizations

### Memory Management
- **Process Monitoring**: Memory usage tracking
- **Garbage Collection**: Efficient cleanup
- **Resource Limits**: Memory constraints
- **Leak Prevention**: Proper resource disposal

### Startup Performance
- **Lazy Loading**: Load resources on demand
- **Preload Optimization**: Minimal preload script
- **Bundle Optimization**: Efficient bundling
- **Caching**: Resource caching strategies

## Error Handling and Logging

### Error Tracking
- **Uncaught Exceptions**: Global error handling
- **Unhandled Rejections**: Promise error tracking
- **IPC Errors**: Communication error handling
- **Window Errors**: UI error management

### Logging Strategy
- **Console Logging**: Development logging
- **File Logging**: Production log files
- **Error Reporting**: Crash reporting
- **Performance Monitoring**: Performance metrics

## Platform-Specific Features

### macOS Features
- **Touch Bar**: Touch Bar integration
- **Notifications**: Native notifications
- **Menu Bar**: Menu bar integration
- **Dock**: Dock badge and menu

### Windows Features
- **System Tray**: System tray integration
- **Jump Lists**: Windows jump lists
- **Taskbar**: Progress indicators
- **File Explorer**: Context menu integration

### Linux Features
- **Desktop Files**: Desktop entry creation
- **System Integration**: DE integration
- **Package Management**: Package metadata
- **Autostart**: Startup integration

## Future Enhancements

### Planned Features
- **Auto-updater**: Automatic application updates
- **Deep Linking**: URL scheme handling
- **Plugin System**: Extension support
- **Multi-window**: Multiple window support

### Performance Improvements
- **Worker Threads**: Background processing
- **Native Modules**: Performance-critical native code
- **GPU Acceleration**: Hardware acceleration
- **Memory Optimization**: Advanced memory management