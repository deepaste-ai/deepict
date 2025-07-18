# Deepict - AI-Powered JSON Visualization Tool [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/deepaste-ai/deepict)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> 🚀 **Deepict** is an AI-powered JSON data visualization tool that makes complex JSON data intuitive and easy to understand. Through intelligent analysis and beautiful visualization interfaces, it helps developers quickly understand and analyze data structures.

## 🎥 Product Demo

https://github.com/user-attachments/assets/3921b770-9c25-4598-9f65-d9460bbddde1

*👆 Watch the complete feature demonstration of Deepict*

## 🌟 Core Features

- **🤖 AI Smart Analysis** - Uses Claude AI to automatically analyze JSON data structure and generate optimal visualization solutions
- **📊 Multiple Visualizations** - Supports tables, charts, tree diagrams and various data display methods
- **🎨 Beautiful Interface** - Modern dark theme design following Apple design standards
- **📁 File Support** - Supports drag-and-drop upload for JSON and JSONL file formats
- **💬 Smart Conversation** - Interact with AI through chat interface for customized data visualization needs
- **🔍 Data Search** - Quickly search and filter specific content in JSON data
- **🖥️ Desktop Application** - Cross-platform desktop app supporting Windows, macOS and Linux

## 🎯 Use Cases

- **API Development & Debugging** - Quickly view and analyze API response data
- **Data Analysis** - Convert complex JSON data into intuitive visualization charts
- **Log Analysis** - Analyze JSONL format log files
- **Configuration File Viewing** - Visualize and edit configuration files
- **Data Migration** - Validate and analyze JSON formats during data migration process

---

## 🛠️ Technical Architecture

[🇨🇳 中文版](./README_CN.md)

## ✨ Technical Features

- **🚀 Next.js 15** - Latest App Router with React 19
- **⚡ Electron 37** - Cross-platform desktop app framework
- **🎨 Mantine 8** - Modern React components library with dark mode support
- **💅 Emotion** - CSS-in-JS styling with excellent performance
- **🔧 Tailwind CSS 4** - Utility-first CSS framework
- **📦 Sass** - Enhanced CSS with variables and mixins
- **🎯 TypeScript** - Full type safety throughout the stack
- **🔥 Hot Reload** - Fast development with instant updates
- **📱 Responsive Design** - Mobile-first approach with adaptive layouts
- **🌙 Dark Mode** - Built-in dark/light theme switching
- **🎭 SVG Support** - Automatic SVG to React component conversion
- **📦 Auto Updates** - Ready for electron-updater integration
- **🔒 Security** - Context isolation and secure preload scripts

## 🛠️ Tech Stack

| Category            | Technology                    | Purpose                            |
| ------------------- | ----------------------------- | ---------------------------------- |
| **Frontend**        | Next.js 15 + React 19         | Modern web application framework   |
| **Desktop**         | Electron 37                   | Cross-platform desktop runtime     |
| **UI Library**      | Mantine 8                     | Component library with theming     |
| **Styling**         | Emotion + Tailwind CSS + Sass | Multi-layered styling solution     |
| **AI Service**      | Anthropic Claude              | Smart data analysis and visualization |
| **Language**        | TypeScript                    | Type-safe development              |
| **Package Manager** | pnpm                          | Fast, efficient package management |
| **Build Tool**      | tsup                          | TypeScript bundler for Electron    |
| **Code Quality**    | ESLint + dprint               | Linting and formatting             |

## 🚀 Deployment Options

Deepict now supports multiple deployment methods:

### 📱 Web Deployment (New!)
Deploy as a web application accessible through browsers:

```bash
# Quick web deployment
pnpm web:build
pnpm web:start
```

### 🐳 Docker Deployment (New!)
Containerized deployment for easy scaling:

```bash
# Using Docker Compose
docker-compose up -d

# Or manual Docker build
docker build -t deepict:latest .
docker run -p 3000:3000 deepict:latest
```

### 🖥️ Desktop Application (Original)
Cross-platform desktop application:

```bash
# Development
pnpm dev

# Production build
pnpm build && pnpm dist
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Anthropic API Key (for AI features)
- Docker (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/deepaste-ai/deepict
cd deepict

# Install dependencies
pnpm install

# Choose your deployment method:

# 1. Desktop Development (original)
pnpm dev

# 2. Web Development
pnpm web:dev

# 3. Docker Development
docker-compose up --build
```

### Setup API Key

1. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Anthropic API Key:
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

3. Or configure via the application settings UI

### Deployment Targets

- **Desktop**: Electron app with native OS integration
- **Web**: Browser-based application with PWA support
- **Docker**: Containerized deployment for cloud platforms

## 📜 Available Scripts

### Development

```bash
# Desktop Development (Electron)
pnpm dev          # Start both Next.js and Electron in development
pnpm next:dev     # Start Next.js development server only
pnpm electron:dev # Start Electron with hot reload only

# Web Development
pnpm web:dev      # Start web development server
pnpm web:build    # Build for web deployment
pnpm web:start    # Start web production server

# Docker Development
pnpm docker:dev   # Start with Docker Compose
pnpm docker:build # Build Docker image
pnpm docker:run   # Run Docker container
```

### Building & Distribution

```bash
# Desktop Distribution
pnpm build        # Build for production (Electron)
pnpm dist         # Create distribution package
pnpm dist:nsis    # Create Windows installer (NSIS)
pnpm dist:deb     # Create Linux package (DEB)

# Web Distribution
pnpm web:build    # Build for web deployment
pnpm web:start    # Start web production server

# Docker Distribution
pnpm docker:build # Build Docker image
pnpm docker:prod  # Run production Docker container
```

### Automated Deployment

```bash
# Use deployment script for automated builds
./scripts/deploy.sh -t web              # Web deployment
./scripts/deploy.sh -t electron         # Electron deployment
./scripts/deploy.sh -t docker -d v1.0.0 # Docker deployment
```

### Code Quality

```bash
pnpm next:lint    # Run ESLint
pnpm format       # Format code with dprint
```

## 🏗️ Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── fapi/            # API routes for AI services
│   │   ├── layout.tsx       # Root layout with providers
│   │   └── page.tsx         # Main application page
│   ├── components/          # React components
│   │   ├── AIChat.tsx       # AI chat interface
│   │   ├── JsonViewer.tsx   # JSON data viewer
│   │   ├── JsonList.tsx     # JSON list navigation
│   │   ├── FileDropzone.tsx # File upload component
│   │   ├── Settings.tsx     # Settings configuration
│   │   └── basic/           # Core registry components
│   ├── stores/              # Zustand state management
│   ├── services/            # API services and SSE
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles and Sass files
│   ├── types/               # TypeScript type definitions
│   └── assets/              # Static assets
├── electron/
│   ├── main.ts              # Electron main process
│   └── preload.ts           # Preload script for IPC
├── build-assets/            # Build assets (icons, etc.)
├── public/                  # Static files
├── build/                   # Compiled Electron files
└── .next/                   # Next.js build output
```

## 🎯 Key Features Explained

### AI-Powered Data Analysis

- **Smart Structure Recognition**: Automatically detects data patterns and relationships
- **Context-Aware Visualization**: Generates appropriate charts based on data type and content
- **Natural Language Interface**: Describe what you want to see in plain English
- **Iterative Refinement**: Continuously improve visualizations through conversation

### Multi-Format Data Support

- **JSON Files**: Standard JSON data structures
- **JSONL Files**: Line-delimited JSON for streaming data and logs
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Real-time Processing**: Instant parsing and visualization

### Comprehensive Visualization Engine

- **Interactive Charts**: Dynamic charts with ECharts integration
- **Data Tables**: Sortable and filterable tabular views
- **Tree Visualization**: Hierarchical data representation
- **Code Highlighting**: Syntax-highlighted JSON with collapsible sections

### Desktop Application Benefits

- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Local Processing**: No data leaves your machine
- **Offline Capable**: Works without internet connection
- **Performance**: Native desktop performance with web technologies

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Anthropic API Key (optional - can be set in app settings)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=Deepict
```

### API Key Setup

You can configure your Anthropic API Key in two ways:

1. **Through the Application** (Recommended):
   - Launch Deepict
   - Click the settings icon in the AI chat panel
   - Enter your API key securely

2. **Environment Variable**:
   - Set `ANTHROPIC_API_KEY` in your `.env.local` file
   - Restart the application

### Customizing Visualization

- **AI Prompts**: Modify system prompts in `src/servers/fapi/index.ts`
- **Chart Themes**: Update chart configurations for different themes
- **UI Theme**: Customize Mantine theme in `src/components/basic/MantineRegistry.tsx`

### Window Configuration

Edit `electron/main.ts` to customize the application window:

```typescript
const mainWindow = new BrowserWindow({
  width: 1400,
  height: 900,
  minWidth: 1000,
  minHeight: 700,
  // Add more window options
});
```

### Styling Configuration

- **Mantine Theme**: Modify `src/components/basic/MantineRegistry.tsx`
- **Tailwind Config**: Edit `tailwind.config.js`
- **Global Styles**: Update `src/styles/globals.css`

## 🚢 Building for Production

### Desktop App Distribution

```bash
# Build for current platform
pnpm dist

# Build for specific platforms
pnpm dist:nsis    # Windows
pnpm dist:deb     # Linux
```

### Customizing Build

Edit `package.json` build configuration:

```json
{
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Electron](https://www.electronjs.org/) - Build cross-platform desktop apps
- [Mantine](https://mantine.dev/) - Modern React components library
- [Anthropic](https://www.anthropic.com/) - AI services powering intelligent data analysis
- [ECharts](https://echarts.apache.org/) - Powerful charting and visualization library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management

## 📞 Support

- 🐛 [Report Issues](https://github.com/deepaste-ai/deepict/issues)
- 💬 [Discussions](https://github.com/deepaste-ai/deepict/discussions)
- 📖 [Documentation](https://github.com/deepaste-ai/deepict/wiki)

---

<div align="center">
    <p>Made with ❤️ by <a href="https://github.com/AIEPhoenix">AIEPhoenix</a> & <a href="https://github.com/pandazki">Pandazki</a></p>
  <p>⭐ Star this repository if Deepict helped you visualize your data!</p>
</div>
