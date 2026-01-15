# AC Storage & Cookies Manager

[English](./README_EN.md) | [中文](./README.md)

**AC Storage & Cookies Manager** 是一个功能强大的浏览器开发者工具扩展（DevTools Extension），专为前端开发者设计。它允许你在 Chrome 或 Edge 浏览器的开发者工具中，高效地管理和调试 Cookies、LocalStorage 和 SessionStorage。

## ✨ 主要特性 (Features)

*   **全能存储管理**：
    *   支持 **Cookies**、**LocalStorage**、**SessionStorage** 的查看、添加、编辑和删除。
    *   提供搜索过滤功能，快速定位 Key/Value。
*   **智能导入导出**：
    *   **剪贴板操作**：抛弃繁琐的文件上传下载，直接复制粘贴即可导入导出。
    *   **多种格式支持**：
        *   JSON (支持标准格式及简易 Key-Value 数组)
        *   Cookie Header String (适用于 Postman/Curl)
        *   Netscape Cookie File (适用于 wget/curl)
    *   **导入预览与差异对比**：导入前自动分析数据，展示新增、修改和未变的条目数量，防止误操作。
    *   **智能识别**：自动识别粘贴的数据类型并导入到正确的存储区域（如在 SessionStorage 标签页粘贴会自动导入到 SessionStorage）。
*   **优秀的用户体验**：
    *   **现代化 UI**：支持 **深色 (Dark)** 和 **浅色 (Light)** 主题切换。
    *   **国际化 (i18n)**：内置 **中文** 和 **英文** 支持，自动跟随浏览器语言或手动切换。
    *   **一键复制**：表格中每个字段（Name/Value）都配有快捷复制按钮。
    *   **交互反馈**：操作成功时的 Toast 提示与庆祝动画（Confetti）。

## 🚀 安装指南 (Installation)

### 方式一：加载已解压的扩展程序 (开发/源码安装)

1.  下载本仓库源码或 Release 包。
2.  打开 Chrome 或 Edge 浏览器，进入扩展程序管理页面：
    *   Chrome: 输入 `chrome://extensions/`
    *   Edge: 输入 `edge://extensions/`
3.  开启右上角的 **"开发者模式" (Developer mode)**。
4.  点击 **"加载已解压的扩展程序" (Load unpacked)**。
5.  选择本项目的根目录（包含 `manifest.json` 的文件夹）。

### 方式二：应用商店安装 (待发布)

*   *（此处可预留 Microsoft Edge Add-ons 商店链接）*

## 📖 使用说明 (Usage)

1.  打开任意网页。
2.  按 `F12` 或右键选择“检查”打开 **开发者工具 (DevTools)**。
3.  在顶部的标签栏中找到 **"AC Storage Manager"**（如果没有看到，可能折叠在 `>>` 更多图标里）。
4.  **查看数据**：切换上方的 Tabs 选择查看 Cookies、LocalStorage 或 SessionStorage。
5.  **编辑/删除**：点击表格右侧的 "Edit" 或 "Del" 按钮。
6.  **导出数据**：
    *   点击右上角的 **Export** 按钮。
    *   数据将自动以 JSON 格式复制到您的剪贴板。
7.  **导入数据**：
    *   点击右上角的 **Import** 按钮。
    *   在弹窗中粘贴数据（支持 JSON 数组或对象）。
    *   点击 **Preview** 查看变更详情，确认无误后导入。

## 🛠️ 技术栈 (Tech Stack)

*   **Manifest V3**: 符合最新的浏览器扩展标准。
*   **Vanilla JS**: 无任何大型框架依赖，轻量、原生、高性能。
*   **CSS Variables**: 灵活的主题定制系统。

## 🤝 贡献 (Contributing)

欢迎提交 Issue 或 Pull Request 来改进这个项目！

## 📄 许可证 (License)

MIT License
