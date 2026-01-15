// Global State
let appState = {
    cookies: [],
    localStorage: [],
    sessionStorage: [],
    currentUrl: "",
    currentDomain: "",
    activeTab: "cookies",
    theme: localStorage.getItem('theme') || "dark",
    lang: localStorage.getItem('lang') || "en"
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadLang();
    setupEventListeners();
    refreshData();
});

// Refresh on navigation
chrome.devtools.network.onNavigated.addListener(() => {
    refreshData();
});

function refreshData() {
    chrome.devtools.inspectedWindow.eval('window.location.href', (result, isException) => {
        if (isException || !result) {
            console.error("Failed to get URL", isException);
            return;
        }
        appState.currentUrl = result;
        try {
            const urlObj = new URL(result);
            appState.currentDomain = urlObj.hostname;
        } catch(e) {
            appState.currentDomain = "";
        }

        loadCookies();
        loadStorage('localStorage');
        loadStorage('sessionStorage');
    });
}

// --- I18n System ---

function loadLang() {
    if (!localStorage.getItem('lang')) {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('zh')) {
            appState.lang = 'zh';
        }
    }
    applyLang();
}

function toggleLang() {
    appState.lang = appState.lang === 'en' ? 'zh' : 'en';
    localStorage.setItem('lang', appState.lang);
    applyLang();
}

function applyLang() {
    const t = I18n[appState.lang];
    const isZh = appState.lang === 'zh';
    
    // Update Toggle Button Text
    const langBtnText = document.querySelector('#langToggleBtn .text');
    if (langBtnText) langBtnText.textContent = isZh ? '中/EN' : 'EN/中';

    // Update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // Re-render current tab to update JS-generated texts
    if (appState.activeTab === 'cookies') renderCookies();
    else renderStorage(appState.activeTab);
}

function getI18n(key, params = {}) {
    let text = I18n[appState.lang][key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

// --- Data Loading ---

function loadCookies() {
    chrome.cookies.getAll({ url: appState.currentUrl }, (cookies) => {
        appState.cookies = cookies;
        if (appState.activeTab === 'cookies') {
            renderCookies();
        }
    });
}

function loadStorage(type) {
    const script = `
        (function() {
            try {
                const storage = window.${type};
                const data = [];
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    data.push({ key: key, value: storage.getItem(key) });
                }
                return data;
            } catch (e) {
                return [];
            }
        })()
    `;

    chrome.devtools.inspectedWindow.eval(script, (result, isException) => {
        if (isException) {
            console.error(`Failed to load ${type}`, isException);
            appState[type] = [];
        } else {
            appState[type] = result;
        }
        
        if (appState.activeTab === type) {
            renderStorage(type);
        }
    });
}

// --- Rendering ---

// --- Helper Functions ---

function copyTextToClipboard(text) {
    // 优先尝试 navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(err => {
            console.warn("navigator.clipboard failed, trying fallback:", err);
            return fallbackCopyText(text);
        });
    }
    // 不支持 clipboard API 时直接使用 fallback
    return fallbackCopyText(text);
}

function fallbackCopyText(text) {
    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            
            // 确保元素在视口内但不可见，避免 display:none 或 left:-9999px 可能导致的问题
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            textarea.style.opacity = '0'; // 透明
            
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                resolve();
            } else {
                reject(new Error('execCommand copy failed'));
            }
        } catch (err) {
            reject(err);
        }
    });
}

function createCopyBtn(text) {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '📄'; // Icon for copy
    btn.title = getI18n('copy');
    btn.onclick = (e) => {
        e.stopPropagation();
        copyTextToClipboard(text).then(() => {
            showToast(getI18n('msgCopied'));
            if (typeof Confetti !== 'undefined') Confetti.launch();
        }).catch(() => {
            showToast(getI18n('msgCopyFailed'));
        });
    };
    return btn;
}

function renderCookies() {
    const tbody = document.querySelector('#cookiesTable tbody');
    tbody.innerHTML = '';
    
    const filter = document.getElementById('searchInput').value.toLowerCase();

    appState.cookies.forEach(cookie => {
        if (filter && !cookie.name.toLowerCase().includes(filter) && !cookie.domain.toLowerCase().includes(filter)) {
            return;
        }

        const tr = document.createElement('tr');
        
        // Domain
        const tdDomain = document.createElement('td');
        tdDomain.textContent = cookie.domain;
        tr.appendChild(tdDomain);

        // Name
        const tdName = document.createElement('td');
        tdName.className = 'key-col';
        const divName = document.createElement('div');
        divName.className = 'cell-content';
        const spanName = document.createElement('span');
        spanName.className = 'text-value';
        spanName.textContent = cookie.name;
        spanName.title = cookie.name;
        divName.appendChild(spanName);
        divName.appendChild(createCopyBtn(cookie.name));
        tdName.appendChild(divName);
        tr.appendChild(tdName);

        // Value
        const tdValue = document.createElement('td');
        tdValue.className = 'value-col';
        const divValue = document.createElement('div');
        divValue.className = 'cell-content';
        const spanValue = document.createElement('span');
        spanValue.className = 'text-value';
        spanValue.textContent = cookie.value;
        spanValue.title = cookie.value;
        divValue.appendChild(spanValue);
        divValue.appendChild(createCopyBtn(cookie.value));
        tdValue.appendChild(divValue);
        tr.appendChild(tdValue);

        // Details
        const tdDetails = document.createElement('td');
        tdDetails.className = 'details-col';
        tdDetails.innerHTML = `
            <small>Path: ${escapeHtml(cookie.path)}</small>
            <small>${cookie.httpOnly ? 'HttpOnly' : ''} ${cookie.secure ? 'Secure' : ''} ${cookie.sameSite}</small>
            <small>Exp: ${cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : 'Session'}</small>
        `;
        tr.appendChild(tdDetails);

        // Actions
        const tdActions = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn small'; // Added 'small' class for consistent styling
        editBtn.textContent = getI18n('btnEdit');
        // Store data in dataset for handler
        editBtn.dataset.type = 'cookies';
        editBtn.dataset.name = cookie.name;
        editBtn.dataset.domain = cookie.domain;
        editBtn.dataset.path = cookie.path;
        editBtn.dataset.storeid = cookie.storeId;
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn danger small';
        delBtn.textContent = getI18n('btnDel');
        delBtn.dataset.type = 'cookies';
        delBtn.dataset.name = cookie.name;
        delBtn.dataset.domain = cookie.domain;
        delBtn.dataset.path = cookie.path;
        delBtn.dataset.storeid = cookie.storeId;

        tdActions.appendChild(editBtn);
        tdActions.appendChild(delBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function renderStorage(type) {
    const tbody = document.querySelector(`#${type}Table tbody`);
    tbody.innerHTML = '';

    const filter = document.getElementById('searchInput').value.toLowerCase();

    appState[type].forEach(item => {
        if (filter && !item.key.toLowerCase().includes(filter)) {
            return;
        }

        const tr = document.createElement('tr');
        
        // Key
        const tdKey = document.createElement('td');
        tdKey.className = 'key-col';
        const divKey = document.createElement('div');
        divKey.className = 'cell-content';
        const spanKey = document.createElement('span');
        spanKey.className = 'text-value';
        spanKey.textContent = item.key;
        spanKey.title = item.key;
        divKey.appendChild(spanKey);
        divKey.appendChild(createCopyBtn(item.key));
        tdKey.appendChild(divKey);
        tr.appendChild(tdKey);

        // Value
        const tdValue = document.createElement('td');
        tdValue.className = 'value-col';
        const divValue = document.createElement('div');
        divValue.className = 'cell-content';
        const spanValue = document.createElement('span');
        spanValue.className = 'text-value';
        spanValue.textContent = item.value;
        spanValue.title = item.value;
        divValue.appendChild(spanValue);
        divValue.appendChild(createCopyBtn(item.value));
        tdValue.appendChild(divValue);
        tr.appendChild(tdValue);

        // Actions
        const tdActions = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn small';
        editBtn.textContent = getI18n('btnEdit');
        editBtn.dataset.type = type;
        editBtn.dataset.key = item.key;
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn danger small';
        delBtn.textContent = getI18n('btnDel');
        delBtn.dataset.type = type;
        delBtn.dataset.key = item.key;

        tdActions.appendChild(editBtn);
        tdActions.appendChild(delBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- Theme Management ---

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        appState.theme = savedTheme;
    }
    applyTheme();
}

function toggleTheme() {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', appState.theme);
    applyTheme();
}

function applyTheme() {
    document.body.className = `theme-${appState.theme}`;
    const btn = document.getElementById('themeToggleBtn');
    if (appState.theme === 'dark') {
        btn.querySelector('.icon').textContent = '🌙'; 
    } else {
        btn.querySelector('.icon').textContent = '☀️'; 
    }
}

// --- Toast Notification ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}


// --- Event Listeners ---

function setupEventListeners() {
    // Theme
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    
    // Lang
    document.getElementById('langToggleBtn').addEventListener('click', toggleLang);

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            const tab = e.target.getAttribute('data-tab');
            document.getElementById(tab).classList.add('active');
            appState.activeTab = tab;
            
            if (tab === 'cookies') renderCookies();
            else renderStorage(tab);
        });
    });

    // Refresh
    document.getElementById('refreshBtn').addEventListener('click', refreshData);

    // Search
    document.getElementById('searchInput').addEventListener('input', () => {
        if (appState.activeTab === 'cookies') renderCookies();
        else renderStorage(appState.activeTab);
    });

    // Clear All
    document.getElementById('clearAllBtn').addEventListener('click', () => {
        if (confirm(getI18n('msgConfirmClear'))) {
            clearAll();
        }
    });

    // Table Actions (Edit/Delete) - Delegated
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            handleDelete(e.target.dataset);
        } else if (e.target.classList.contains('edit-btn')) {
            handleEdit(e.target.dataset);
        }
    });

    // Add Button
    document.getElementById('addBtn').addEventListener('click', () => {
        openModal(true);
    });

    // Modal Close
    document.querySelectorAll('.close, #cancelEditBtn').forEach(el => {
        el.addEventListener('click', () => {
            document.getElementById('editModal').style.display = 'none';
        });
    });
    
    // Modal Submit
    document.getElementById('editForm').addEventListener('submit', handleFormSubmit);

    // Import/Export
    document.getElementById('copyExportBtn').addEventListener('click', handleExportClipboard);
    document.getElementById('pasteImportBtn').addEventListener('click', () => {
        document.getElementById('importTextarea').value = ''; 
        document.getElementById('importModal').style.display = 'block';
        document.getElementById('importTextarea').focus();
    });
    
    // Import Modal Actions
    document.getElementById('closeImportModal').addEventListener('click', () => {
        document.getElementById('importModal').style.display = 'none';
    });
    document.getElementById('cancelImportBtn').addEventListener('click', () => {
        document.getElementById('importModal').style.display = 'none';
    });
    document.getElementById('previewImportBtn').addEventListener('click', handleImportPreview);
}

// --- CRUD Operations ---

function handleDelete(dataset) {
    if (confirm(getI18n('msgConfirmClear') ? "Delete this item?" : "Delete this item?")) { // Fallback text just in case, or make a separate key
         // Use a specific key for delete item confirmation if needed, for now reuse or just hardcode/add key
         // Let's add 'confirmDelete' key logic implicitly or just use simple text since it wasn't in dict
         // Actually, let's just proceed.
    } else {
        return;
    }

    if (dataset.type === 'cookies') {
        let urlToRemove = appState.currentUrl; 
        
        chrome.cookies.remove({
            url: urlToRemove,
            name: dataset.name,
            storeId: dataset.storeid
        }, (details) => {
            if (!details) {
                let domain = dataset.domain;
                if (domain.startsWith('.')) domain = domain.substring(1);
                urlToRemove = "http://" + domain + dataset.path;
                chrome.cookies.remove({
                    url: urlToRemove,
                    name: dataset.name,
                    storeId: dataset.storeid
                }, () => loadCookies());
            } else {
                loadCookies();
            }
        });
    } else {
        const type = dataset.type;
        const key = dataset.key;
        const script = `window.${type}.removeItem('${key.replace(/'/g, "\\'")}')`;
        chrome.devtools.inspectedWindow.eval(script, () => {
            loadStorage(type);
        });
    }
}

function clearAll() {
    if (appState.activeTab === 'cookies') {
        appState.cookies.forEach(c => {
            const protocol = c.secure ? 'https:' : 'http:';
            const domain = c.domain.startsWith('.') ? c.domain.substring(1) : c.domain;
            const url = `${protocol}//${domain}${c.path}`;
            chrome.cookies.remove({
                url: url,
                name: c.name,
                storeId: c.storeId
            });
        });
        setTimeout(loadCookies, 500);
    } else {
        const type = appState.activeTab;
        chrome.devtools.inspectedWindow.eval(`window.${type}.clear()`, () => {
            loadStorage(type);
        });
    }
}

// --- Modal & Editing ---

let isEditing = false;
let currentEditType = "";

function openModal(isNew, data = null) {
    isEditing = !isNew;
    currentEditType = appState.activeTab;
    
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('editForm');
    
    title.textContent = isNew ? getI18n('modalAddTitle') : getI18n('modalEditTitle');
    form.reset();

    // Toggle Cookie specific fields
    const cookieOptions = document.getElementById('cookieOptions');
    const domainGroup = document.getElementById('domainGroup');
    
    if (currentEditType === 'cookies') {
        cookieOptions.style.display = 'block';
        domainGroup.style.display = 'flex'; 
        
        if (isNew) {
            document.getElementById('editDomain').value = appState.currentDomain;
        } else if (data) {
            // Fill data
            const cookie = appState.cookies.find(c => c.name === data.name && c.domain === data.domain);
            if (cookie) {
                document.getElementById('editDomain').value = cookie.domain;
                document.getElementById('editPath').value = cookie.path;
                document.getElementById('editName').value = cookie.name;
                document.getElementById('editValue').value = cookie.value;
                document.getElementById('editSecure').checked = cookie.secure;
                document.getElementById('editHttpOnly').checked = cookie.httpOnly;
                document.getElementById('editSameSite').value = cookie.sameSite || 'unspecified';
                if (cookie.expirationDate) {
                    const date = new Date(cookie.expirationDate * 1000);
                    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                    document.getElementById('editExpiration').value = date.toISOString().slice(0, 16);
                }
            }
        }
    } else {
        cookieOptions.style.display = 'none';
        domainGroup.style.display = 'none';
        
        if (data) {
            document.getElementById('editName').value = data.key;
            const item = appState[currentEditType].find(i => i.key === data.key);
            if (item) {
                document.getElementById('editValue').value = item.value;
            }
        }
    }
    
    modal.style.display = 'block';
}

function handleEdit(dataset) {
    openModal(false, dataset);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('editName').value;
    const value = document.getElementById('editValue').value;
    
    if (currentEditType === 'cookies') {
        const domain = document.getElementById('editDomain').value;
        const path = document.getElementById('editPath').value;
        const secure = document.getElementById('editSecure').checked;
        const httpOnly = document.getElementById('editHttpOnly').checked;
        const sameSite = document.getElementById('editSameSite').value;
        const expirationInput = document.getElementById('editExpiration').value;
        
        let expirationDate = null;
        if (expirationInput) {
            expirationDate = new Date(expirationInput).getTime() / 1000;
        }
        
        let url = "http" + (secure ? "s" : "") + "://" + (domain.startsWith('.') ? domain.substring(1) : domain) + path;
        
        const cookieDetails = {
            url: url,
            name: name,
            value: value,
            domain: domain,
            path: path,
            secure: secure,
            httpOnly: httpOnly,
            sameSite: sameSite
        };
        
        if (expirationDate) {
            cookieDetails.expirationDate = expirationDate;
        }
        
        chrome.cookies.set(cookieDetails, (cookie) => {
            if (chrome.runtime.lastError) {
                alert("Error setting cookie: " + chrome.runtime.lastError.message);
            } else {
                document.getElementById('editModal').style.display = 'none';
                loadCookies();
            }
        });
        
    } else {
        // Storage
        const script = `window.${currentEditType}.setItem('${name.replace(/'/g, "\\'")}', '${value.replace(/'/g, "\\'")}')`;
        chrome.devtools.inspectedWindow.eval(script, (result, isException) => {
            if (isException) {
                alert("Error setting storage");
            } else {
                document.getElementById('editModal').style.display = 'none';
                loadStorage(currentEditType);
            }
        });
    }
}

// --- Import / Export ---

function handleExportClipboard() {
    const format = document.getElementById('exportFormat').value;
    let content = "";
    
    try {
        if (format === 'json') {
            // Check if we are only exporting a specific list (filtered or active tab)
            // But currently the requirement seems to be just exporting the current view or all
            // The user wants a simple array format if possible, or maybe just the relevant data
            
            // Let's modify the structure.
            // If the user is on LocalStorage or SessionStorage tab, they likely want just that data as a simple KV array or object.
            // If the user provided example is an array of objects {name, value}, let's see if we can support that "Simplified" export.
            
            // Actually, the user COMPLAINED that the output is the complex "version, source, data..." structure
            // and they WANTED the simple array format: [ {name, value}, ... ]
            
            // So we should check which tab is active and export ONLY that data in the simplified format.
            
            let exportData = [];
            
            if (appState.activeTab === 'cookies') {
                 exportData = (appState.cookies || []).map(c => ({
                     name: c.name,
                     value: c.value,
                     // Optional: keep other fields if needed for re-import, but user asked for simple name/value
                     // But for FULL restore, we need more. 
                     // However, the user example shows just name/value. 
                     // Let's compromise: If it's for "View/Copy", simple is better.
                     // But for "Backup", full is better.
                     // Let's stick to the User's request: "I want this format" -> Simple Array.
                     // We will include other important fields but keep the structure flat.
                     domain: c.domain,
                     path: c.path
                 }));
            } else if (appState.activeTab === 'localStorage') {
                exportData = (appState.localStorage || []).map(item => {
                    let val = item.value;
                    try {
                        // Try to parse JSON value to make export prettier
                        val = JSON.parse(item.value);
                    } catch(e) {
                        // Not JSON, keep as string
                    }
                    return {
                        name: item.key,
                        value: val
                    };
                });
            } else if (appState.activeTab === 'sessionStorage') {
                 exportData = (appState.sessionStorage || []).map(item => {
                    let val = item.value;
                    try {
                        val = JSON.parse(item.value);
                    } catch(e) {}
                    return {
                        name: item.key,
                        value: val
                    };
                });
            }
            
            content = JSON.stringify(exportData, null, 2);
            
        } else if (format === 'header') {
            content = Utils.exportToHeaderString(appState.cookies || []);
        } else if (format === 'netscape') {
            content = Utils.exportToNetscape(appState.cookies || []);
        }

        copyTextToClipboard(content).then(() => {
            showToast(getI18n('msgCopied'));
            if (typeof Confetti !== 'undefined') Confetti.launch();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast(getI18n('msgCopyFailed'));
        });
    } catch (e) {
        console.error("Export generation failed:", e);
        showToast(getI18n('msgCopyFailed'));
    }
}

function handleImportPreview() {
    const content = document.getElementById('importTextarea').value;
    if (!content.trim()) return;

    let data = null;
    
    if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        data = Utils.importFromJSON(content);
    } else if (content.includes('# Netscape')) {
        data = Utils.parseNetscape(content);
    } else {
        data = Utils.parseHeaderString(content, appState.currentDomain);
    }
    
    if (!data) {
        alert(getI18n('msgParseFailed'));
        return;
    }

    const diff = calculateDiff(data);
    
    const message = getI18n('msgImportSummary', {
        c_new: diff.cookies.new, c_upd: diff.cookies.update, c_same: diff.cookies.same,
        l_new: diff.localStorage.new, l_upd: diff.localStorage.update, l_same: diff.localStorage.same,
        s_new: diff.sessionStorage.new, s_upd: diff.sessionStorage.update, s_same: diff.sessionStorage.same
    });

    if (confirm(message)) {
        importData(data);
        document.getElementById('importModal').style.display = 'none';
        showToast(getI18n('msgImportSuccess'));
        if (typeof Confetti !== 'undefined') Confetti.launch();
    }
}

function calculateDiff(importData) {
    const diff = {
        cookies: { new: 0, update: 0, same: 0 },
        localStorage: { new: 0, update: 0, same: 0 },
        sessionStorage: { new: 0, update: 0, same: 0 }
    };

    // Cookies
    if (importData.cookies && Array.isArray(importData.cookies)) {
        importData.cookies.forEach(c => {
            const existing = appState.cookies.find(ec => ec.name === c.name && ec.domain === c.domain && ec.path === c.path);
            if (!existing) {
                diff.cookies.new++;
            } else if (existing.value !== c.value) {
                diff.cookies.update++;
            } else {
                diff.cookies.same++;
            }
        });
    }

    // Storage
    ['localStorage', 'sessionStorage'].forEach(type => {
        if (importData[type]) {
            const currentMap = appState[type].reduce((acc, curr) => ({...acc, [curr.key]: curr.value}), {});
            Object.entries(importData[type]).forEach(([key, value]) => {
                if (!(key in currentMap)) {
                    diff[type].new++;
                } else if (currentMap[key] !== value) {
                    diff[type].update++;
                } else {
                    diff[type].same++;
                }
            });
        }
    });

    return diff;
}

function importData(data) {
    // 1. Import Cookies
    if (data.cookies && Array.isArray(data.cookies)) {
        data.cookies.forEach(c => {
            let url = "http" + (c.secure ? "s" : "") + "://" + (c.domain.startsWith('.') ? c.domain.substring(1) : c.domain) + c.path;
            
            const details = {
                url: url,
                name: c.name,
                value: c.value,
                domain: c.domain,
                path: c.path,
                secure: c.secure,
                httpOnly: c.httpOnly,
                sameSite: c.sameSite || 'unspecified',
                storeId: c.storeId
            };
            
            if (c.expirationDate) details.expirationDate = c.expirationDate;
            
            chrome.cookies.set(details);
        });
        setTimeout(loadCookies, 500);
    }
    
    // 2. Import Storage
    // Logic update: If we have "localStorage" data from import, check active tab.
    // If active tab is sessionStorage, maybe the user INTENDED to import there?
    // But Utils.importFromJSON puts generic KV into localStorage by default.
    // Let's be smart: If data.localStorage has content, but data.sessionStorage is empty,
    // AND the current active tab is sessionStorage, let's ask or just import to active tab?
    // For now, let's keep it simple: Import to what the JSON says.
    // But for the "Simple Array" import (which goes to localStorage default), 
    // if the user is currently viewing SessionStorage, they probably want it there.
    
    let targetLocalStorage = data.localStorage;
    let targetSessionStorage = data.sessionStorage;

    // Heuristic: If we have data in localStorage ONLY (likely from simple array import)
    // AND the user is currently on SessionStorage tab, move it there.
    if (data.localStorage && Object.keys(data.localStorage).length > 0 &&
        (!data.sessionStorage || Object.keys(data.sessionStorage).length === 0)) {
        
        if (appState.activeTab === 'sessionStorage') {
             targetSessionStorage = data.localStorage;
             targetLocalStorage = {};
        }
    }

    if (targetLocalStorage) {
        Object.entries(targetLocalStorage).forEach(([key, value]) => {
             // Handle if value is Object (from pretty export)
             let strValue = value;
             if (typeof value === 'object' && value !== null) {
                 strValue = JSON.stringify(value);
             }
             
             const script = `window.localStorage.setItem('${key.replace(/'/g, "\\'")}', '${strValue.replace(/'/g, "\\'")}')`;
             chrome.devtools.inspectedWindow.eval(script);
        });
        setTimeout(() => loadStorage('localStorage'), 200);
    }
    
    if (targetSessionStorage) {
        Object.entries(targetSessionStorage).forEach(([key, value]) => {
             let strValue = value;
             if (typeof value === 'object' && value !== null) {
                 strValue = JSON.stringify(value);
             }

             const script = `window.sessionStorage.setItem('${key.replace(/'/g, "\\'")}', '${strValue.replace(/'/g, "\\'")}')`;
             chrome.devtools.inspectedWindow.eval(script);
        });
        setTimeout(() => loadStorage('sessionStorage'), 200);
    }
}
