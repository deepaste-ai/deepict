# Deepict - Project Documentation

This directory contains comprehensive documentation for the Deepict project, an AI-powered JSON visualization desktop application.

## Project Overview

Deepict is a modern desktop application built with Electron and Next.js that transforms complex JSON data into intuitive visualizations using AI-powered analysis from Anthropic Claude.

### Key Features
- **AI-Powered Visualization**: Leverages Claude AI for intelligent data analysis
- **Multiple File Formats**: Supports both JSON and JSONL files
- **Real-time Streaming**: Server-Sent Events for live AI responses
- **Interactive Interface**: Multi-tab viewer with search capabilities
- **Cross-platform**: Windows, macOS, and Linux support
- **Modern UI**: Built with Mantine and Tailwind CSS

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 + React 19
- **Desktop Runtime**: Electron 37
- **UI Framework**: Mantine 8 + Tailwind CSS 4
- **State Management**: Zustand
- **API Integration**: Anthropic Claude API
- **Build Tools**: TypeScript + ESBuild

### Application Structure
```
deepict/
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── stores/           # Zustand state management
│   ├── services/         # External service integrations
│   ├── utils/            # Utility functions
│   └── servers/          # API server implementation
├── electron/             # Electron main process
├── docs/                 # Project documentation
├── build-assets/         # Build resources
└── public/              # Static assets
```

## Core Components Documentation

### Frontend Components (`/src/components/`)
- **AIChat**: Main AI interaction interface with streaming responses
- **JsonViewer**: Multi-tab JSON visualization component
- **FileDropzone**: Drag-and-drop file upload interface
- **JsonList**: JSONL file navigation and item selection
- **SearchBar**: Global search functionality
- **Settings**: Configuration modal for API keys and preferences

### State Management (`/src/stores/`)
- **useAppStore**: Centralized Zustand store managing:
  - File processing and JSON data
  - Chat conversation history
  - AI processing state
  - Search functionality
  - User settings and preferences

### API Layer (`/src/servers/`)
- **FAPI Server**: Hono-based API server with:
  - Claude AI integration
  - Server-Sent Events streaming
  - CORS and compression middleware
  - Input validation and error handling

### Services (`/src/services/`)
- **SSE Service**: Real-time streaming communication
- **Error handling**: Comprehensive error management
- **Connection management**: Robust connection handling

### Utilities (`/src/utils/`)
- **File Parser**: JSON/JSONL file processing
- **Chat Message Generation**: Formatted file upload messages
- **Data Transformation**: Utility functions for data manipulation

## Development Guide

### Prerequisites
- Node.js 18+
- pnpm (recommended package manager)
- Anthropic API key

### Setup Instructions
1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd json-visualization
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure API Key**
   - Set `ANTHROPIC_API_KEY` environment variable, or
   - Configure via application settings UI

4. **Development Mode**
   ```bash
   # Start Next.js dev server
   pnpm next:dev
   
   # Start Electron (in separate terminal)
   pnpm electron:dev
   
   # Or start both together
   pnpm dev
   ```

### Build and Distribution
```bash
# Build for production
pnpm build

# Create platform-specific distributions
pnpm dist:nsis    # Windows installer
pnpm dist:deb     # Linux package
pnpm dist         # Current platform
```

### Code Quality
```bash
# Linting and formatting
pnpm next:lint
pnpm format
pnpm prettier:check
```

## API Documentation

### FAPI Endpoints

#### POST `/fapi/gen-vis-comp`
Generate HTML visualization components for JSON data.

**Request Body:**
```typescript
{
  prevHTML?: string;    // Previous HTML for iteration
  json: string;         // JSON data to visualize
  userInput?: string;   // User requirements
  apiKey?: string;      // Anthropic API key
}
```

**Response:** Server-Sent Events stream with:
- `resp` events: Status updates and text responses
- `html` events: Generated HTML component content

### State Management API

#### App Store Methods
- `processFile(content, type, filename, fileSize)`: Process uploaded files
- `generateHTMLComponent(userInput?)`: Generate AI visualizations
- `addChatMessage(message)`: Add chat messages
- `setCurrentJsonId(id)`: Switch between JSON items
- `setSearchQuery(query)`: Filter JSON data

## Configuration

### Environment Variables
- `ANTHROPIC_API_KEY`: Claude API key for AI functionality
- `NODE_ENV`: Development/production mode
- `PORT`: Development server port (default: 3000)

### Build Configuration
- **Next.js**: Standalone mode for Electron integration
- **Electron Builder**: Cross-platform packaging
- **TypeScript**: Strict mode with path mapping
- **ESLint**: Code quality enforcement

## Security Considerations

### Data Security
- **API Keys**: Secure storage in localStorage
- **Input Validation**: Comprehensive input sanitization
- **Iframe Sandboxing**: Isolated execution of generated HTML
- **CORS Configuration**: Secure cross-origin requests

### Process Security
- **Context Isolation**: Separate execution contexts
- **Preload Script**: Controlled API exposure
- **Sandboxed Renderer**: Limited system access
- **IPC Validation**: Secure inter-process communication

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Dynamic imports for large components
- **Lazy Loading**: On-demand resource loading
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: Efficient large dataset rendering

### Backend Performance
- **Streaming Responses**: Real-time data delivery
- **Compression**: Response compression for non-streaming
- **Connection Pooling**: Efficient resource utilization
- **Caching**: Strategic response caching

## Testing Strategy

### Test Categories
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

### Test Tools
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **Lighthouse**: Performance auditing

## Deployment

### Desktop Distribution
- **Electron Builder**: Cross-platform packaging
- **Code Signing**: Digital signatures for security
- **Auto-updater**: Automatic application updates
- **Platform Packages**: Native installers

### CI/CD Pipeline
- **GitHub Actions**: Automated build and test
- **Quality Gates**: Code quality enforcement
- **Release Automation**: Automated release process
- **Cross-platform Builds**: Multi-platform compilation

## Troubleshooting

### Common Issues
- **API Key Configuration**: Settings modal for key setup
- **File Processing Errors**: Comprehensive error messages
- **Connection Issues**: Retry logic and fallback handling
- **Performance**: Optimization strategies

### Debug Tools
- **Chrome DevTools**: Frontend debugging
- **Electron DevTools**: Process debugging
- **Console Logging**: Structured logging
- **Error Reporting**: Comprehensive error tracking

## Contributing

### Development Guidelines
- **Code Style**: ESLint and Prettier configuration
- **TypeScript**: Full type safety requirements
- **Testing**: Test coverage requirements
- **Documentation**: Comprehensive documentation

### Pull Request Process
1. **Fork Repository**: Create feature branch
2. **Implement Changes**: Follow coding standards
3. **Add Tests**: Ensure test coverage
4. **Update Documentation**: Document changes
5. **Submit PR**: Detailed description and review

## Future Roadmap

### Planned Features
- **Enhanced AI Models**: Support for multiple AI providers
- **Advanced Visualizations**: More chart types and customization
- **Cloud Integration**: Cloud storage and sharing
- **Plugin System**: Extensible architecture
- **Multi-language Support**: Internationalization

### Performance Improvements
- **Native Modules**: Performance-critical native code
- **Advanced Caching**: Intelligent caching strategies
- **GPU Acceleration**: Hardware-accelerated rendering
- **Memory Optimization**: Advanced memory management

## License and Legal

### License Information
- **License Type**: [License details]
- **Copyright**: [Copyright information]
- **Third-party Licenses**: [Dependencies licenses]

### Privacy and Security
- **Data Handling**: Local processing, no data collection
- **API Usage**: Anthropic Claude API terms
- **Security Practices**: Regular security audits