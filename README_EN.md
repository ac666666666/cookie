# AC Storage & Cookies Manager

[中文](./README.md) | [English](./README_EN.md)

**AC Storage & Cookies Manager** is a powerful browser DevTools extension designed for frontend developers. It allows you to efficiently manage and debug Cookies, LocalStorage, and SessionStorage within Chrome or Edge DevTools.

## ✨ Features

*   **Comprehensive Storage Management**:
    *   View, Add, Edit, and Delete **Cookies**, **LocalStorage**, and **SessionStorage**.
    *   Search and filter keys/values instantly.
*   **Smart Import & Export**:
    *   **Clipboard Operations**: Say goodbye to file uploads. Just copy and paste to import/export.
    *   **Multi-Format Support**:
        *   JSON (Standard format & Simple Key-Value Array)
        *   Cookie Header String (for Postman/Curl)
        *   Netscape Cookie File (for wget/curl)
    *   **Import Preview & Diff**: Analyze data before importing. See what's new, updated, or unchanged to prevent accidents.
    *   **Smart Recognition**: Automatically detects data types and imports them to the correct storage (e.g., pasting in the SessionStorage tab imports to SessionStorage).
*   **Excellent User Experience**:
    *   **Modern UI**: Switch between **Dark** and **Light** themes.
    *   **I18n**: Built-in **English** and **Chinese** support (auto-detects browser language).
    *   **One-Click Copy**: Copy Name/Value instantly from the table.
    *   **Interactive Feedback**: Toast notifications and confetti animations on success.

## 🚀 Installation

### Method 1: Load Unpacked (Development)

1.  Download the source code or release package.
2.  Open your browser's extension management page:
    *   Chrome: `chrome://extensions/`
    *   Edge: `edge://extensions/`
3.  Enable **"Developer mode"** in the top right corner.
4.  Click **"Load unpacked"**.
5.  Select the project root directory (containing `manifest.json`).

### Method 2: Store Installation (Coming Soon)

*   *(Link to Microsoft Edge Add-ons Store will be here)*

## 📖 Usage

1.  Open any webpage.
2.  Press `F12` or right-click and select "Inspect" to open **DevTools**.
3.  Find **"AC Storage Manager"** in the top tab bar (it might be hidden under the `>>` icon).
4.  **View Data**: Switch tabs to see Cookies, LocalStorage, or SessionStorage.
5.  **Edit/Delete**: Use the "Edit" or "Del" buttons on the right side of the table.
6.  **Export**:
    *   Click the **Export** button.
    *   Data is automatically copied to your clipboard in JSON format.
7.  **Import**:
    *   Click the **Import** button.
    *   Paste your data (JSON array or object).
    *   Click **Preview** to see changes, then confirm to import.

## 🛠️ Tech Stack

*   **Manifest V3**: Compliant with the latest browser extension standards.
*   **Vanilla JS**: No heavy frameworks, lightweight and fast.
*   **CSS Variables**: Flexible theming system.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License
