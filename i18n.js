const I18n = {
    en: {
        appTitle: "Storage Manager",
        themeTitle: "Toggle Theme",
        langTitle: "Switch Language",
        
        // Tabs
        tabCookies: "Cookies",
        tabLocal: "Local Storage",
        tabSession: "Session Storage",
        
        // Actions
        refresh: "Refresh",
        clearAll: "Clear All",
        copyExport: "Copy Export",
        pasteImport: "Paste Import",
        addItem: "Add Item",
        searchPlaceholder: "Filter...",
        
        // Table Headers
        thDomain: "Domain",
        thName: "Name",
        thKey: "Key",
        thValue: "Value",
        thDetails: "Details",
        thActions: "Actions",
        
        // Table Content
        btnEdit: "Edit",
        btnDel: "Del",
        copy: "Copy",
        
        // Modal - Edit
        modalAddTitle: "Add New Item",
        modalEditTitle: "Edit Item",
        labelDomain: "Domain",
        labelPath: "Path",
        labelName: "Name / Key",
        labelValue: "Value",
        labelSecure: "Secure",
        labelHttpOnly: "HttpOnly",
        labelSameSite: "SameSite",
        labelExpiration: "Expiration",
        btnCancel: "Cancel",
        btnSave: "Save Changes",
        
        // Modal - Import
        modalImportTitle: "Import Data",
        importHint: "Paste your JSON, Cookie Header string, or Netscape content here:",
        importPlaceholder: "Paste data here...",
        btnPreviewImport: "Preview & Import",
        
        // Select Options
        optUnspecified: "Unspecified",
        optNone: "None",
        optLax: "Lax",
        optStrict: "Strict",
        
        // Messages
        msgCopied: "Copied to clipboard!",
        msgCopyFailed: "Failed to copy",
        msgConfirmClear: "Are you sure you want to clear ALL items in the current tab?",
        msgImportSuccess: "Import Successful!",
        msgParseFailed: "Failed to parse data",
        msgImportSummary: "Import Summary:\nCookies: {c_new} new, {c_upd} overwrite, {c_same} unchanged\nLocalStorage: {l_new} new, {l_upd} overwrite, {l_same} unchanged\nSessionStorage: {s_new} new, {s_upd} overwrite, {s_same} unchanged\n\nProceed to import?"
    },
    zh: {
        appTitle: "存储管理器",
        themeTitle: "切换主题",
        langTitle: "切换语言",
        
        // Tabs
        tabCookies: "Cookies",
        tabLocal: "本地存储",
        tabSession: "会话存储",
        
        // Actions
        refresh: "刷新",
        clearAll: "清空所有",
        copyExport: "复制导出",
        pasteImport: "粘贴导入",
        addItem: "新增",
        searchPlaceholder: "过滤...",
        
        // Table Headers
        thDomain: "域名",
        thName: "名称",
        thKey: "键",
        thValue: "值",
        thDetails: "详情",
        thActions: "操作",
        
        // Table Content
        btnEdit: "编辑",
        btnDel: "删除",
        copy: "复制",
        
        // Modal - Edit
        modalAddTitle: "新增项目",
        modalEditTitle: "编辑项目",
        labelDomain: "域名",
        labelPath: "路径",
        labelName: "名称 / 键",
        labelValue: "值",
        labelSecure: "安全 (Secure)",
        labelHttpOnly: "仅HTTP (HttpOnly)",
        labelSameSite: "同站策略 (SameSite)",
        labelExpiration: "过期时间",
        btnCancel: "取消",
        btnSave: "保存更改",
        
        // Modal - Import
        modalImportTitle: "导入数据",
        importHint: "在此粘贴 JSON、Cookie Header 字符串或 Netscape 内容：",
        importPlaceholder: "在此粘贴数据...",
        btnPreviewImport: "预览并导入",
        
        // Select Options
        optUnspecified: "未指定",
        optNone: "无限制 (None)",
        optLax: "宽松 (Lax)",
        optStrict: "严格 (Strict)",
        
        // Messages
        msgCopied: "已复制到剪贴板！",
        msgCopyFailed: "复制失败",
        msgConfirmClear: "确定要清空当前标签页的所有项目吗？",
        msgImportSuccess: "导入成功！",
        msgParseFailed: "数据解析失败",
        msgImportSummary: "导入摘要：\nCookies: {c_new} 新增, {c_upd} 覆盖, {c_same} 不变\nLocalStorage: {l_new} 新增, {l_upd} 覆盖, {l_same} 不变\nSessionStorage: {s_new} 新增, {s_upd} 覆盖, {s_same} 不变\n\n是否继续导入？"
    }
};
