# Next.js + Electron Template

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A modern, production-ready template for building cross-platform desktop applications with Next.js and Electron.

[🇨🇳 中文版](./README_CN.md)

## ✨ Features

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
| **Language**        | TypeScript                    | Type-safe development              |
| **Package Manager** | pnpm                          | Fast, efficient package management |
| **Build Tool**      | tsup                          | TypeScript bundler for Electron    |
| **Code Quality**    | ESLint + dprint               | Linting and formatting             |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/AIEPhoenix/aie-nextjs-electron-template.git
cd aie-nextjs-electron-template

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will launch with:

- Next.js dev server at `http://localhost:3000`
- Electron app window with hot reload enabled

## 📜 Available Scripts

### Development

```bash
pnpm dev          # Start both Next.js and Electron in development
pnpm next:dev     # Start Next.js development server only
pnpm electron:dev # Start Electron with hot reload only
```

### Building

```bash
pnpm build        # Build for production
pnpm next:build   # Build Next.js only
pnpm electron:build # Build Electron main process only
```

### Distribution

```bash
pnpm dist         # Create distribution package
pnpm dist:nsis    # Create Windows installer (NSIS)
pnpm dist:deb     # Create Linux package (DEB)
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
│   │   ├── layout.tsx       # Root layout with providers
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   └── basic/           # Core registry components
│   ├── styles/              # Global styles and Sass files
│   ├── types/               # TypeScript type definitions
│   └── assets/              # Static assets
├── electron/
│   ├── main.ts              # Electron main process
│   └── preload.ts           # Preload script for IPC
├── public/                  # Static files
├── build/                   # Compiled Electron files
└── .next/                   # Next.js build output
```

## 🎯 Key Features Explained

### Dual-Process Architecture

- **Main Process**: Manages app lifecycle and creates renderer processes
- **Renderer Process**: Runs the Next.js application
- **Preload Script**: Provides secure bridge between main and renderer

### Integrated Styling Stack

- **Mantine**: Primary UI components with built-in theming
- **Emotion**: Component-specific styling with CSS-in-JS
- **Tailwind CSS**: Utility classes for rapid development
- **Sass**: Global styles and Mantine customization

### Production Optimization

- **Standalone Output**: Next.js builds optimized for Electron packaging
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Removes unused code for smaller builds

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_NAME=Your App Name
```

### Customizing Electron Window

Edit `electron/main.ts` to customize window behavior:

```typescript
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
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
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Emotion](https://emotion.sh/) - CSS-in-JS library

## 📞 Support

- 📖 [Documentation](https://github.com/AIEPhoenix/aie-nextjs-electron-template/wiki)
- 🐛 [Report Issues](https://github.com/AIEPhoenix/aie-nextjs-electron-template/issues)
- 💬 [Discussions](https://github.com/AIEPhoenix/aie-nextjs-electron-template/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/AIEPhoenix">AIEPhoenix</a></p>
  <p>⭐ Star this repository if it helped you!</p>
</div>
