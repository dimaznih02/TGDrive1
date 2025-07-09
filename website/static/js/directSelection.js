// 🔧 DIRECT CONTEXT MENU & SELECTION SYSTEM - Production Ready
console.log('🔧 Initializing Direct Selection System...');

// Global variables
let directSelected = new Set();

// Utility function to normalize file paths
function normalizePath(el) {
    return (el?.getAttribute('data-path') || el?.getAttribute('data-name') || '').trim();
}

// CSS Injection for direct selection styling
function injectDirectSelectionCSS() {
    const directCSS = document.createElement('style');
    directCSS.id = 'direct-selection-css';
    directCSS.innerHTML = `
    .direct-selected {
        background: linear-gradient(135deg, #e3f2fd, #bbdefb) !important;
        border: 3px solid #2196f3 !important;
        border-radius: 10px !important;
        box-shadow: 0 4px 12px rgba(33,150,243,0.4) !important;
        position: relative !important;
    }

    .direct-selected::after {
        content: '✓';
        position: absolute;
        top: 8px;
        left: 8px;
        background: #2196f3;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    #direct-context-menu {
        position: fixed;
        background: rgba(255,255,255,0.98);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 999999;
        padding: 8px;
        min-width: 200px;
        font-family: Arial, sans-serif;
        display: none;
    }

    .direct-menu-item {
        padding: 12px 16px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: #333;
    }

    .direct-menu-item:hover {
        background: rgba(25,118,210,0.1);
    }

    .direct-menu-item.pilih-item {
        background: rgba(25,118,210,0.05);
        border: 1px solid rgba(25,118,210,0.2);
        font-weight: 600;
        color: #1976d2;
    }

    .direct-menu-item.pilih-item:hover {
        background: rgba(25,118,210,0.15);
    }

    .direct-menu-divider {
        height: 1px;
        background: rgba(0,0,0,0.1);
        margin: 8px 12px;
    }

    #direct-notification {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #2196f3, #1976d2);
        color: white;
        padding: 16px 24px;
        border-radius: 30px;
        box-shadow: 0 8px 24px rgba(33,150,243,0.4);
        z-index: 99999;
        display: none;
        font-weight: 600;
        font-family: Arial, sans-serif;
    }

    .direct-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 15px;
        margin-left: 12px;
        cursor: pointer;
        font-weight: 600;
    }

    .direct-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: translateY(-1px);
    }
    `;
    document.head.appendChild(directCSS);
    console.log('✅ Direct selection CSS injected');
}

// Create notification bar
function createDirectNotificationBar() {
    // Remove existing notification if any
    const existingNotification = document.getElementById('direct-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const directNotification = document.createElement('div');
    directNotification.id = 'direct-notification';
    directNotification.innerHTML = `
        <span id="direct-count">0 item dipilih</span>
        <button class="direct-btn" onclick="directMove()">📁 Pindahkan</button>
        <button class="direct-btn" onclick="directClear()">❌ Batal</button>
    `;
    document.body.appendChild(directNotification);
    console.log('✅ Direct notification bar created');
}

// Create context menu element
function createDirectContextMenu() {
    // Remove existing context menu if any
    const existingContextMenu = document.getElementById('direct-context-menu');
    if (existingContextMenu) {
        existingContextMenu.remove();
    }

    const directContextMenu = document.createElement('div');
    directContextMenu.id = 'direct-context-menu';
    document.body.appendChild(directContextMenu);
    console.log('✅ Direct context menu element created');
}

// Core Functions
window.directSelect = function(element) {
    const path = normalizePath(element);
    if (!path) {
        console.warn('⚠️ No valid path found for element:', element);
        return;
    }

    if (directSelected.has(path)) {
        directSelected.delete(path);
        element.classList.remove('direct-selected');
        console.log('❌ Deselected:', path);
    } else {
        directSelected.add(path);
        element.classList.add('direct-selected');
        console.log('✅ Selected:', path);
    }

    updateDirectCounter();
    hideDirectMenu();
};

window.directClear = function() {
    console.log('🧹 Clearing all selections...');
    document.querySelectorAll('.direct-selected').forEach(el => {
        el.classList.remove('direct-selected');
    });
    directSelected.clear();
    updateDirectCounter();
    console.log('✅ All selections cleared');
};

window.directMove = function() {
    if (directSelected.size === 0) {
        console.log('⚠️ No files selected for move operation');
        return;
    }
    
    const fileList = Array.from(directSelected).join('\n• ');
    alert(`📁 Memindahkan ${directSelected.size} file:\n\n• ${fileList}\n\n(Demo - nanti terhubung ke API move files)`);
    console.log('📁 Move operation triggered for:', Array.from(directSelected));
};

function updateDirectCounter() {
    const count = directSelected.size;
    const counterElement = document.getElementById('direct-count');
    const notificationElement = document.getElementById('direct-notification');
    
    if (counterElement) {
        counterElement.textContent = `${count} item dipilih`;
    }
    
    if (notificationElement) {
        notificationElement.style.display = count > 0 ? 'block' : 'none';
    }
    
    console.log(`📊 Counter updated: ${count} items selected`);
    console.log('📦 Selected files:', Array.from(directSelected));
}

function hideDirectMenu() {
    const menu = document.getElementById('direct-context-menu');
    if (menu) {
        menu.style.display = 'none';
    }
}

function showDirectMenu(e, element) {
    const fileName = element.getAttribute('data-name');
    const fileType = element.getAttribute('data-type') || 'file';
    const path = normalizePath(element);
    const isSelected = directSelected.has(path);

    const menu = document.getElementById('direct-context-menu');
    
    // Smart positioning to prevent menu going off-screen
    const menuHTML = `
        <div class="direct-menu-item pilih-item" onclick="directSelect(document.querySelector('[data-name=\\'${fileName}\\']'))">
            <span style="font-size: 16px;">${isSelected ? '☑️' : '📋'}</span>
            <span>${isSelected ? 'Batal Pilih' : 'Pilih'}</span>
        </div>
        <div class="direct-menu-divider"></div>
        <div class="direct-menu-item" onclick="alert('📂 Fitur ${fileType === 'folder' ? 'buka folder' : 'buka file'} belum tersedia'); hideDirectMenu();">
            <span style="font-size: 16px;">📂</span>
            <span>${fileType === 'folder' ? 'Buka Folder' : 'Buka File'}</span>
        </div>
        <div class="direct-menu-item" onclick="alert('⬇️ Fitur download belum tersedia'); hideDirectMenu();">
            <span style="font-size: 16px;">⬇️</span>
            <span>Download</span>
        </div>
        <div class="direct-menu-divider"></div>
        <div class="direct-menu-item" onclick="alert('✏️ Fitur rename belum tersedia'); hideDirectMenu();">
            <span style="font-size: 16px;">✏️</span>
            <span>Ganti Nama</span>
        </div>
        <div class="direct-menu-item" onclick="alert('🗑️ Fitur hapus belum tersedia'); hideDirectMenu();">
            <span style="font-size: 16px;">🗑️</span>
            <span>Hapus</span>
        </div>
    `;
    
    menu.innerHTML = menuHTML;
    
    // Position menu with smart boundary detection
    let left = e.clientX;
    let top = e.clientY;
    
    // Make menu visible to measure dimensions
    menu.style.visibility = 'hidden';
    menu.style.display = 'block';
    
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position
    if (left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - 10;
    }
    
    // Adjust vertical position
    if (top + menuRect.height > viewportHeight) {
        top = e.clientY - menuRect.height - 5;
    }
    
    // Apply final position
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.visibility = 'visible';
    
    console.log('✅ Context menu shown for:', fileName, 'at position:', { left, top });
}

// Attach context menu listeners to all file items
function attachContextListeners() {
    console.log('🔗 Attaching context menu listeners...');
    
    document.querySelectorAll('.file-item, [data-name]').forEach(item => {
        // Clone node to remove existing event listeners
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Add context menu listener
        newItem.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Hide any existing menus
            document.querySelectorAll('[id*="menu"], [id*="context"]').forEach(menu => {
                if (menu.id !== 'direct-context-menu') {
                    menu.style.display = 'none';
                    menu.remove();
                }
            });
            
            showDirectMenu(e, newItem);
            return false;
        }, true);
        
        console.log('📁 Context menu attached to:', newItem.getAttribute('data-name'));
    });
    
    console.log('✅ Context menu listeners attached to all file items');
}

// Global click handler to hide context menu
function setupGlobalClickHandler() {
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('direct-context-menu');
        if (menu && !menu.contains(e.target)) {
            hideDirectMenu();
        }
    });
    console.log('✅ Global click handler setup');
}

// Keyboard shortcuts handler
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // CTRL+A - Select all files
        if (e.ctrlKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            
            let addedCount = 0;
            document.querySelectorAll('.file-item, [data-name]').forEach(item => {
                const path = normalizePath(item);
                if (path && !directSelected.has(path)) {
                    directSelected.add(path);
                    item.classList.add('direct-selected');
                    addedCount++;
                }
            });
            
            updateDirectCounter();
            console.log(`✅ CTRL+A: Selected ${addedCount} additional files. Total: ${directSelected.size}`);
            return;
        }
        
        // ESC - Clear all selections
        if (e.key === 'Escape') {
            e.preventDefault();
            window.directClear();
            hideDirectMenu();
            console.log('✅ ESC: Cleared all selections');
            return;
        }
    });
    
    console.log('✅ Keyboard shortcuts setup (CTRL+A, ESC)');
}

// Function to reinitialize after directory refresh
window.reinitializeDirectSelection = function() {
    console.log('🔄 Reinitializing direct selection system...');
    attachContextListeners();
    console.log('✅ Direct selection system reinitialized');
};

// Main initialization function
function initializeDirectSelectionSystem() {
    console.log('🚀 Starting Direct Selection System initialization...');
    
    try {
        // Inject CSS
        injectDirectSelectionCSS();
        
        // Create UI elements
        createDirectNotificationBar();
        createDirectContextMenu();
        
        // Setup event handlers
        attachContextListeners();
        setupGlobalClickHandler();
        setupKeyboardShortcuts();
        
        // Expose functions globally
        window.directSelect = window.directSelect;
        window.directClear = window.directClear;
        window.directMove = window.directMove;
        window.hideDirectMenu = hideDirectMenu;
        
        console.log('✅ Direct Selection System initialized successfully!');
        console.log('📖 Usage:');
        console.log('   🖱️  Right-click file → Context menu');
        console.log('   ⌨️  CTRL+A → Select all files');
        console.log('   ⌨️  ESC → Clear all selections');
        
        // Show success notification
        const successToast = document.createElement('div');
        successToast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(76,175,80,0.4);
            z-index: 99999;
            font-weight: 600;
            font-family: Arial, sans-serif;
        `;
        successToast.textContent = '🔧 Direct Selection System Ready!';
        document.body.appendChild(successToast);
        setTimeout(() => successToast.remove(), 4000);
        
    } catch (error) {
        console.error('❌ Error initializing Direct Selection System:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDirectSelectionSystem);
} else {
    // DOM already loaded
    initializeDirectSelectionSystem();
}

// Also initialize after a short delay to ensure all other scripts have loaded
setTimeout(initializeDirectSelectionSystem, 500);

console.log('📦 Direct Selection System script loaded');