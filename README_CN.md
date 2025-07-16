# Deepict - AI 驱动的 JSON 可视化工具

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=for-the-badge&logo=mantine&logoColor=white)](https://mantine.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> 🚀 **Deepict** 是一个基于 AI 的 JSON 数据可视化工具，让复杂的 JSON 数据变得直观易懂。通过智能分析和美观的可视化界面，帮助开发者快速理解和分析数据结构。

[🇺🇸 English Version](./README.md)

## 🎥 产品演示

<video width="100%" controls>
  <source src="demo.mp4" type="video/mp4">
  <p>您的浏览器不支持视频播放。<a href="demo.mp4">点击此处下载视频</a></p>
</video>

*👆 观看 Deepict 的完整功能演示*

## 🌟 核心特性

- **🤖 AI 智能分析** - 使用 Claude AI 自动分析 JSON 数据结构并生成最佳可视化方案
- **📊 多种可视化** - 支持表格、图表、树状图等多种数据展示方式
- **🎨 美观界面** - 现代化的深色主题设计，符合苹果设计标准
- **📁 文件支持** - 支持 JSON 和 JSONL 文件格式的拖拽上传
- **💬 智能对话** - 通过聊天界面与 AI 交互，定制化数据可视化需求
- **🔍 数据搜索** - 快速搜索和筛选 JSON 数据中的特定内容
- **🖥️ 桌面应用** - 跨平台桌面应用，支持 Windows、macOS 和 Linux

## 🎯 使用场景

- **API 开发调试** - 快速查看和分析 API 响应数据
- **数据分析** - 将复杂的 JSON 数据转换为直观的可视化图表
- **日志分析** - 分析 JSONL 格式的日志文件
- **配置文件查看** - 可视化查看和编辑配置文件
- **数据迁移** - 验证和分析数据迁移过程中的 JSON 格式

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+
- Anthropic API Key (用于 AI 功能)

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/yourusername/deepict.git
cd deepict

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 配置 API Key

1. 在应用中点击设置按钮
2. 输入您的 Anthropic API Key
3. 开始使用 AI 可视化功能

## 📜 可用脚本

### 开发

```bash
pnpm dev          # 同时启动 Next.js 和 Electron 开发环境
pnpm next:dev     # 仅启动 Next.js 开发服务器
pnpm electron:dev # 仅启动 Electron 热重载
```

### 构建

```bash
pnpm build        # 构建生产版本
pnpm next:build   # 仅构建 Next.js
pnpm electron:build # 仅构建 Electron 主进程
```

### 打包分发

```bash
pnpm dist         # 创建分发包
pnpm dist:nsis    # 创建 Windows 安装程序
pnpm dist:deb     # 创建 Linux 软件包
```

## 🛠️ 技术栈

| 类别            | 技术                    | 用途                    |
| --------------- | ----------------------- | ----------------------- |
| **前端框架**    | Next.js 15 + React 19  | 现代 Web 应用框架       |
| **桌面应用**    | Electron 37             | 跨平台桌面应用运行时    |
| **UI 组件库**   | Mantine 8               | 现代化组件库与主题系统  |
| **样式方案**    | Emotion + Tailwind CSS | 多层次样式解决方案      |
| **开发语言**    | TypeScript              | 类型安全的开发体验      |
| **AI 服务**     | Anthropic Claude        | 智能数据分析与可视化    |
| **包管理器**    | pnpm                    | 快速高效的包管理        |

## 📁 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router 页面
│   ├── components/          # React 组件
│   │   ├── AIChat.tsx       # AI 聊天界面
│   │   ├── JsonViewer.tsx   # JSON 查看器
│   │   ├── JsonList.tsx     # JSON 列表
│   │   └── FileDropzone.tsx # 文件上传组件
│   ├── stores/              # Zustand 状态管理
│   ├── services/            # API 服务
│   ├── utils/               # 工具函数
│   └── styles/              # 全局样式
├── electron/
│   ├── main.ts              # Electron 主进程
│   └── preload.ts           # 预加载脚本
├── build-assets/            # 构建资源
│   └── icon.png             # 应用图标
└── public/                  # 静态资源
```

## 🎨 功能特色

### AI 智能分析

- **数据洞察**: 自动分析 JSON 数据结构和内容
- **可视化建议**: 根据数据特征推荐最佳可视化方案
- **交互式对话**: 通过自然语言描述定制化需求

### 多格式支持

- **JSON 文件**: 标准 JSON 格式数据
- **JSONL 文件**: 每行一个 JSON 对象的格式
- **拖拽上传**: 支持文件拖拽和点击上传

### 可视化展示

- **数据预览**: 原始数据的结构化展示
- **图表可视化**: 自动生成的交互式图表
- **代码视图**: 格式化的 JSON 代码展示

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件进行本地配置：

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 自定义主题

在 `src/components/basic/MantineRegistry.tsx` 中修改主题配置：

```typescript
const theme = createTheme({
  // 自定义主题配置
});
```

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 生产级框架
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用构建工具
- [Mantine](https://mantine.dev/) - 现代化 React 组件库
- [Anthropic](https://www.anthropic.com/) - AI 服务提供商
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

## 📞 支持

- 🐛 [报告问题](https://github.com/yourusername/deepict/issues)
- 💬 [讨论交流](https://github.com/yourusername/deepict/discussions)
- 📖 [查看文档](https://github.com/yourusername/deepict/wiki)

---

<div align="center">
  <p>用 ❤️ 制作，让数据可视化更简单</p>
  <p>⭐ 如果这个项目对你有帮助，请给它一个 Star！</p>
</div>