# Next.js + Electron 模板

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> 一个现代化的、生产就绪的模板，用于构建基于 Next.js 和 Electron 的跨平台桌面应用程序。

[🇺🇸 English Version](./README.md)

## ✨ 特性

- **🚀 Next.js 15** - 最新的 App Router 搭配 React 19
- **⚡ Electron 37** - 跨平台桌面应用框架
- **🎨 Mantine 8** - 现代 React 组件库，支持暗黑模式
- **💅 Emotion** - 高性能的 CSS-in-JS 样式解决方案
- **🔧 Tailwind CSS 4** - 实用优先的 CSS 框架
- **📦 Sass** - 增强的 CSS，支持变量和混合
- **🎯 TypeScript** - 全栈类型安全
- **🔥 热重载** - 快速开发，即时更新
- **📱 响应式设计** - 移动优先的自适应布局
- **🌙 暗黑模式** - 内置暗黑/明亮主题切换
- **🎭 SVG 支持** - 自动将 SVG 转换为 React 组件
- **📦 自动更新** - 准备好集成 electron-updater
- **🔒 安全性** - 上下文隔离和安全的预加载脚本

## 🛠️ 技术栈

| 分类         | 技术                          | 用途                          |
| ------------ | ----------------------------- | ----------------------------- |
| **前端**     | Next.js 15 + React 19         | 现代 Web 应用程序框架         |
| **桌面**     | Electron 37                   | 跨平台桌面运行时              |
| **UI 库**    | Mantine 8                     | 组件库与主题系统              |
| **样式**     | Emotion + Tailwind CSS + Sass | 多层次样式解决方案            |
| **语言**     | TypeScript                    | 类型安全开发                  |
| **包管理器** | pnpm                          | 快速、高效的包管理            |
| **构建工具** | tsup                          | Electron 的 TypeScript 打包器 |
| **代码质量** | ESLint + dprint               | 代码检查和格式化              |

## 🚀 快速开始

### 前置要求

- Node.js 18+
- pnpm 8+

### 安装

```bash
# 克隆仓库
git clone https://github.com/AIEPhoenix/aie-nextjs-electron-template.git
cd aie-nextjs-electron-template

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

应用程序将启动：

- Next.js 开发服务器运行在 `http://localhost:3000`
- Electron 应用窗口启用热重载

## 📜 可用脚本

### 开发

```bash
pnpm dev          # 同时启动 Next.js 和 Electron 开发模式
pnpm next:dev     # 仅启动 Next.js 开发服务器
pnpm electron:dev # 仅启动 Electron 热重载
```

### 构建

```bash
pnpm build        # 生产环境构建
pnpm next:build   # 仅构建 Next.js
pnpm electron:build # 仅构建 Electron 主进程
```

### 分发

```bash
pnpm dist         # 创建分发包
pnpm dist:nsis    # 创建 Windows 安装程序 (NSIS)
pnpm dist:deb     # 创建 Linux 软件包 (DEB)
```

### 代码质量

```bash
pnpm next:lint    # 运行 ESLint
pnpm format       # 使用 dprint 格式化代码
```

## 🏗️ 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── layout.tsx       # 根布局与提供者
│   │   └── page.tsx         # 主页
│   ├── components/          # React 组件
│   │   └── basic/           # 核心注册组件
│   ├── styles/              # 全局样式和 Sass 文件
│   ├── types/               # TypeScript 类型定义
│   └── assets/              # 静态资源
├── electron/
│   ├── main.ts              # Electron 主进程
│   └── preload.ts           # IPC 预加载脚本
├── public/                  # 静态文件
├── build/                   # 编译后的 Electron 文件
└── .next/                   # Next.js 构建输出
```

## 🎯 核心功能说明

### 双进程架构

- **主进程**：管理应用生命周期并创建渲染进程
- **渲染进程**：运行 Next.js 应用程序
- **预加载脚本**：提供主进程和渲染进程之间的安全桥梁

### 集成样式栈

- **Mantine**：主要 UI 组件，内置主题系统
- **Emotion**：组件特定样式，CSS-in-JS
- **Tailwind CSS**：实用工具类，快速开发
- **Sass**：全局样式和 Mantine 自定义

### 生产优化

- **独立输出**：Next.js 构建针对 Electron 打包优化
- **代码分割**：自动包优化
- **树摇**：移除未使用的代码以减小构建体积

## 🔧 配置

### 环境变量

创建 `.env.local` 文件用于本地开发：

```env
# 在此添加你的环境变量
NEXT_PUBLIC_APP_NAME=你的应用名称
```

### 自定义 Electron 窗口

编辑 `electron/main.ts` 自定义窗口行为：

```typescript
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  // 添加更多窗口选项
});
```

### 样式配置

- **Mantine 主题**：修改 `src/components/basic/MantineRegistry.tsx`
- **Tailwind 配置**：编辑 `tailwind.config.js`
- **全局样式**：更新 `src/styles/globals.css`

## 🚢 生产构建

### 桌面应用分发

```bash
# 为当前平台构建
pnpm dist

# 为特定平台构建
pnpm dist:nsis    # Windows
pnpm dist:deb     # Linux
```

### 自定义构建

编辑 `package.json` 构建配置：

```json
{
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "你的应用名称",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 🤝 贡献

1. Fork 该仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📝 许可证

该项目根据 MIT 许可证授权 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 用于生产的 React 框架
- [Electron](https://www.electronjs.org/) - 构建跨平台桌面应用
- [Mantine](https://mantine.dev/) - 现代 React 组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Emotion](https://emotion.sh/) - CSS-in-JS 库

## 📞 支持

- 📖 [文档](https://github.com/AIEPhoenix/aie-nextjs-electron-template/wiki)
- 🐛 [报告问题](https://github.com/AIEPhoenix/aie-nextjs-electron-template/issues)
- 💬 [讨论](https://github.com/AIEPhoenix/aie-nextjs-electron-template/discussions)

---

<div align="center">
  <p>由 <a href="https://github.com/AIEPhoenix">AIEPhoenix</a> 用 ❤️ 制作</p>
  <p>⭐ 如果这个项目对你有帮助，请给个星星！</p>
</div>
