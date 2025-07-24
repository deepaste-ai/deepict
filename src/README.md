# Deepict - Frontend Source Code

This directory contains the frontend source code for Deepict, an AI-powered JSON visualization desktop application.

## Architecture Overview

Deepict is built using a modern tech stack:

- **Next.js 15** with App Router for the web framework
- **React 19** for the UI components
- **Electron 37** for the desktop runtime
- **Mantine 8** as the primary UI component library
- **Tailwind CSS 4** for utility-first styling
- **Zustand** for state management
- **TypeScript** for type safety

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── fapi/              # API routes for AI functionality
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── basic/            # Core infrastructure components
│   ├── AIChat.tsx        # AI chat interface
│   ├── FileDropzone.tsx  # File upload handling
│   ├── JsonViewer.tsx    # JSON data visualization
│   └── ...
├── servers/              # Server-side logic
│   └── fapi/            # Fast API server implementation
├── services/            # External service integrations
│   └── sse.ts          # Server-Sent Events handling
├── stores/             # State management
│   └── useAppStore.ts  # Zustand store implementation
├── utils/              # Utility functions
│   └── fileParser.ts   # JSON/JSONL file parsing
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

## Key Features

### 1. AI-Powered Visualization

- Integration with Anthropic Claude API for intelligent JSON analysis
- Real-time HTML component generation based on JSON structure
- Streaming responses via Server-Sent Events (SSE)

### 2. File Processing

- Support for both JSON and JSONL file formats
- Drag-and-drop file upload interface
- Automatic file type detection and validation

### 3. Multi-View Interface

- **Visualization Tab**: AI-generated HTML components in iframe
- **Preview Tab**: Interactive JSON tree viewer
- **Raw JSON Tab**: Syntax-highlighted JSON code

### 4. Search & Navigation

- Full-text search across JSON data
- JSONL file navigation with item listing
- Contextual search results

### 5. Chat Interface

- Natural language interaction with AI
- File upload via chat interface
- Message history and conversation management

## Core Components

### AIChat (`/components/AIChat.tsx`)

The main AI interaction interface featuring:

- Chat message display with markdown support
- File upload capability
- Settings access and API key management
- Real-time streaming response handling

### JsonViewer (`/components/JsonViewer.tsx`)

Multi-tab JSON display component:

- Dynamic tab switching between visualization modes
- Iframe sandbox for AI-generated HTML components
- Interactive JSON tree viewer using `@textea/json-viewer`
- Syntax highlighting with `@mantine/code-highlight`

### FileDropzone (`/components/FileDropzone.tsx`)

Full-screen drag-and-drop interface:

- Visual feedback for drag states
- File type validation
- Error handling with notifications

### App Store (`/stores/useAppStore.ts`)

Centralized state management using Zustand:

- File and JSON data management
- Chat message handling
- AI processing state
- Search functionality
- Settings persistence

## API Integration

### FAPI Server (`/servers/fapi/index.ts`)

Fast API server built with Hono framework:

- **Endpoint**: `/fapi/gen-vis-comp`
- **Method**: POST with JSON payload
- **Features**:
  - Streaming responses via SSE
  - Anthropic Claude integration
  - CORS and compression middleware
  - Error handling and API key validation

### SSE Service (`/services/sse.ts`)

Server-Sent Events implementation:

- Real-time streaming of AI responses
- Connection management and error handling
- Retry logic for failed connections

## Development Workflow

### Local Development

```bash
# Start Next.js development server
pnpm next:dev

# Start Electron in development mode
pnpm electron:dev

# Start both Next.js and Electron
pnpm dev
```

### Code Quality

```bash
# Run linting
pnpm next:lint

# Format code
pnpm format

# Check formatting
pnpm prettier:check
```

### Building

```bash
# Build for production
pnpm build

# Create distribution
pnpm dist
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Claude API key (can be set via UI settings)

### Build Configuration

- Next.js configured for standalone mode
- Electron builder for cross-platform distribution
- TypeScript strict mode enabled

## Security Considerations

- iframe sandboxing for AI-generated HTML
- API key storage in localStorage
- Input validation and sanitization
- CORS configuration for development

## Performance Optimizations

- Lazy loading of heavy components
- Efficient state updates with Zustand
- Streaming responses to reduce latency
- Compression middleware for API responses

## Dependencies

### Core Dependencies

- `@ai-sdk/anthropic`: Claude API integration
- `@mantine/core`: UI component library
- `@textea/json-viewer`: JSON visualization
- `hono`: API server framework
- `zustand`: State management

### Development Dependencies

- `typescript`: Type checking
- `eslint`: Code linting
- `prettier`: Code formatting
- `electron-builder`: Desktop app packaging
