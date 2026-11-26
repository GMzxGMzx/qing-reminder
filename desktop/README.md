# 轻提醒 · Windows 桌面版

透明、置顶、可拖拽的悬浮小窗提醒工具，基于 Electron 构建。

## 下载安装

前往本仓库 [Releases](../../releases) 页面下载 `轻提醒 Setup 1.0.0.exe` 安装包，双击安装即可。

> **Windows 智能应用控制提示**：由于安装包未进行代码签名，Windows 11 的「智能应用控制」可能会阻止运行。可在「Windows 安全中心 → 应用和浏览器控制 → 智能应用控制」中关闭该防护后重试（关闭后无法重新开启，请确认可接受）。这不是病毒，是系统对未签名应用的正常拦截。

## 从源码运行

```bash
npm install
npm start
```

启动器 `start.js` 会自动清除 `ELECTRON_RUN_AS_NODE` 环境变量，避免 Electron 以纯 Node 模式启动导致 GUI 失效。

## 自行打包

```bash
npm run dist
```

产物位于 `dist/轻提醒 Setup 1.0.0.exe`。若 Electron 二进制下载失败，可设置国内镜像：

```bash
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

## 功能

- 透明毛玻璃悬浮小窗，始终置顶、可拖拽，可锁定位置、调节透明度
- 小窗展示最近 5 个提醒的实时倒计时，每行可单独「立即完成」
- 点击「▢」展开完整管理窗：添加、暂停、删除、历史、统计
- 到点时窗口自动移动到屏幕正中央弹出确认，需手动确认完成才进入下一轮
- 支持延后 5/15 分钟、提示音、系统托盘

## 数据

数据保存在本机 `localStorage`（key: `qing-reminder-desktop-v1`），不上传服务器。
