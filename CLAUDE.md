# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development

- `pnpm dev` - Start both Next.js and Electron in development mode
- `pnpm next:dev` - Start Next.js development server only (http://localhost:3000)
- `pnpm electron:dev` - Start Electron with hot reload only

### Building

- `pnpm build` - Build for production (runs Next.js build + Electron build)
- `pnpm next:build` - Build Next.js only
- `pnpm electron:build` - Build Electron main process only

### Code Quality

- `pnpm next:lint` - Run ESLint on the codebase
- `pnpm format` - Format code with dprint
- `pnpm prettier:check` - Check code formatting with Prettier
- `pnpm prettier:write` - Format code with Prettier

### Distribution

- `pnpm dist` - Create distribution package for current platform
- `pnpm dist:nsis` - Create Windows installer (NSIS)
- `pnpm dist:deb` - Create Linux package (DEB)

## Architecture Overview

This is a Next.js + Electron desktop application with the following key architectural components:

### Dual-Process Architecture

- **Main Process** (`electron/main.ts`): Manages app lifecycle, creates renderer processes, and handles Next.js server startup in production
- **Renderer Process**: Runs the Next.js application with React components
- **Preload Script** (`electron/preload.ts`): Provides secure IPC bridge between main and renderer processes

### Frontend Stack

- **Next.js 15** with App Router and React 19
- **Mantine 8** as the primary UI component library with built-in theming
- **Emotion** for CSS-in-JS styling with component-specific styles
- **Tailwind CSS 4** for utility-first styling
- **Sass** for global styles and Mantine customization

### Key Components

- **MantineRegistry** (`src/components/basic/MantineRegistry.tsx`): Root provider that sets up Mantine, Emotion, code highlighting, notifications, and modals
- **EmotionRootStyleRegistry** (`src/components/basic/EmotionRootStyleRegistry.tsx`): Manages emotion style injection for SSR compatibility
- **Root Layout** (`src/app/layout.tsx`): Next.js root layout with Mantine providers and color scheme script

### Development vs Production

- **Development**: Next.js dev server runs on port 3000, Electron connects to it
- **Production**: Next.js builds to standalone mode, Electron starts its own server on a dynamic port (30011-50000 range)

### Build Configuration

- Next.js builds in standalone mode for optimal Electron packaging
- Electron builder configured for Windows (NSIS) and Linux (DEB) distributions
- TypeScript compilation handled by tsup for Electron main process

### Package Management

- Uses pnpm as the package manager
- Electron dependencies are only built during installation for performance

### State Manage

- Use zustand
