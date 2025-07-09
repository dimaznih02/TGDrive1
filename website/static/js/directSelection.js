// 🔧 DIRECT CONTEXT MENU & SELECTION SYSTEM - Production Ready
console.log('🔧 Initializing Direct Selection System...');

// Global variables
let directSelected = new Set();

// Utility function to normalize file paths with fallback
function normalizePath(el) {
    let path = el?.getAttribute('data-path')?.trim();
    let name = el?.getAttribute('data-name')?.trim();
    let id = el?.getAttribute('data-id')?.trim();
    
    // Debug: show what we found
    console.log('🔍 normalizePath raw data:', {
        'data-path': path,
        'data-name': name,
        'data-id': id
    });
    
    // Try to build unique identifier
    let result = '';
    
    // Priority 1: data-path (if it's not just root "/")
    if (path && path !== '/' && path.length > 1) {
        result = path;
    }
    // Priority 2: data-name (most reliable for file names)
    else if (name && name.length > 0) {
        result = name;
    }
    // Priority 3: data-id
    else if (id && id.length > 0) {
        result = id;
    }
    // Priority 4: Fallback to .file-name element text
    else {
        const fileNameEl = el?.querySelector('.file-name');
        if (fileNameEl) {
            result = fileNameEl.textContent?.trim();
        }
    }
    
    // Final fallback: create unique ID from element position
    if (!result || result === '/') {
        const allItems = document.querySelectorAll('.file-item, [data-name]');
        const index = Array.from(allItems).indexOf(el);
        result = `file-${index}-${Date.now()}`;
        console.log('⚠️ Using fallback unique ID:', result);
    }
    
    // Final cleanup
    result = (result || '').trim();
    
    // Debug logging
    console.log('🔍 normalizePath debug:', {
        element: el,
        'data-path': path,
        'data-name': name,
        'data-id': id,
        'final result': result,
        'result length': result.length,
        'is unique': result !== '/'
    });
    
    return result;
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


    `;
    document.head.appendChild(directCSS);
    console.log('✅ Direct selection CSS injected');
}

// Setup existing notification bar (no need to create new one)
function setupExistingNotificationBar() {
    // Use existing notification bar in HTML: #selection-notification-bar
    console.log('✅ Using existing notification bar from HTML');
    
    // Wire up existing buttons to our functions
    const moveBtn = document.getElementById('move-selected-btn');
    const deleteBtn = document.getElementById('delete-selected-btn');
    const cancelBtn = document.getElementById('cancel-select-btn');
    
    if (moveBtn) {
        moveBtn.addEventListener('click', directMove);
        console.log('✅ Move button wired up');
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', directClear); // For now, use directClear for delete
        console.log('✅ Delete button wired up');
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', directClear);
        console.log('✅ Cancel button wired up');
    }
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
    console.log('\n🎯 directSelect() called');
    console.log('Element received:', element);
    console.log('Element classes:', element?.className);
    
    const path = normalizePath(element);
    console.log(`📋 normalizePath() returned: "${path}" (length: ${path.length})`);
    
    if (!path) {
        console.warn('⚠️ No valid path found for element:', element);
        console.warn('⚠️ Cannot proceed with selection');
        return;
    }

    const wasSelected = directSelected.has(path);
    console.log(`🔍 Was previously selected: ${wasSelected}`);

    if (wasSelected) {
        directSelected.delete(path);
        element.classList.remove('direct-selected');
        console.log('❌ Deselected:', path);
        console.log(`📦 directSelected size after delete: ${directSelected.size}`);
    } else {
        directSelected.add(path);
        element.classList.add('direct-selected');
        console.log('✅ Selected:', path);
        console.log(`📦 directSelected size after add: ${directSelected.size}`);
    }

    console.log(`📦 Current directSelected contents:`, Array.from(directSelected));
    
    updateDirectCounter();
    hideDirectMenu();
    
    console.log('🎯 directSelect() completed');
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
    console.log(`\n🔄 updateDirectCounter() called`);
    console.log(`📊 directSelected.size: ${count}`);
    console.log(`📦 directSelected contents:`, Array.from(directSelected));
    
    // Use existing notification bar elements from HTML
    const headerCounter = document.getElementById('selected-count-header');
    const notificationBar = document.getElementById('selection-notification-bar');
    const moveBtn = document.getElementById('move-selected-btn');
    const deleteBtn = document.getElementById('delete-selected-btn');
    
    console.log(`🎯 Header counter found:`, !!headerCounter);
    console.log(`🎯 Notification bar found:`, !!notificationBar);
    console.log(`🎯 Move button found:`, !!moveBtn);
    console.log(`🎯 Delete button found:`, !!deleteBtn);
    
    // Update header counter
    if (headerCounter) {
        headerCounter.textContent = count;
        console.log(`📝 Header counter updated to: "${count}"`);
    }
    
    if (notificationElement) {
        const shouldShow = count > 0;
        notificationElement.style.display = shouldShow ? 'block' : 'none';
        console.log(`👁️ Notification display set to: ${shouldShow ? 'visible' : 'hidden'}`);
        console.log(`�️ Notification actual display: ${notificationElement.style.display}`);
    } else {
        console.log('❌ Notification element not found!');
    }
    
    console.log(`✅ updateDirectCounter() completed - using existing HTML notification bar`);
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

// Debug function to analyze DOM structure
function debugDOMStructure() {
    console.log('\n🔍 DOM STRUCTURE ANALYSIS:');
    
    const fileItems = document.querySelectorAll('.file-item, [data-name]');
    console.log(`📁 Found ${fileItems.length} file elements`);
    
    fileItems.forEach((item, index) => {
        console.log(`\n📄 Element ${index + 1}:`);
        console.log('  Element:', item);
        console.log('  Tag:', item.tagName);
        console.log('  Classes:', item.className);
        console.log('  data-name:', item.getAttribute('data-name'));
        console.log('  data-path:', item.getAttribute('data-path'));
        console.log('  data-type:', item.getAttribute('data-type'));
        console.log('  innerHTML preview:', item.innerHTML.substring(0, 100) + '...');
        
        // Look for .file-name elements
        const fileNameEl = item.querySelector('.file-name');
        if (fileNameEl) {
            console.log('  .file-name found:', fileNameEl.textContent?.trim());
        } else {
            console.log('  .file-name: NOT FOUND');
        }
        
        // Test normalizePath on this element
        const normalizedPath = normalizePath(item);
        console.log(`  normalizePath result: "${normalizedPath}" (length: ${normalizedPath.length})`);
    });
    
    console.log('\n✅ DOM Structure analysis completed');
}

// Attach context menu listeners to all file items
function attachContextListeners() {
    console.log('🔗 Attaching context menu listeners...');
    
    // First, analyze DOM structure for debugging
    debugDOMStructure();
    
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
            console.log('🚀 CTRL+A triggered - starting select all process...');
            
            // Find all file elements
            const allElements = document.querySelectorAll('.file-item, [data-name]');
            console.log(`📁 Found ${allElements.length} total elements to process`);
            
            let addedCount = 0;
            let skippedCount = 0;
            let emptyPathCount = 0;
            
            allElements.forEach((item, index) => {
                console.log(`\n🔍 Processing element ${index + 1}/${allElements.length}:`);
                console.log('Element:', item);
                console.log('Element classes:', item.className);
                
                const path = normalizePath(item);
                console.log(`📋 Normalized path: "${path}" (length: ${path.length})`);
                
                if (!path) {
                    emptyPathCount++;
                    console.log('❌ Empty path, skipping this element');
                    return;
                }
                
                if (directSelected.has(path)) {
                    skippedCount++;
                    console.log('⏭️ Already selected, skipping');
                } else {
                    console.log('✅ Adding to selection...');
                    directSelected.add(path);
                    item.classList.add('direct-selected');
                    addedCount++;
                    console.log(`📦 directSelected now contains: ${directSelected.size} items`);
                }
            });
            
            console.log('\n📊 CTRL+A Summary:');
            console.log(`  - Total elements found: ${allElements.length}`);
            console.log(`  - Added to selection: ${addedCount}`);
            console.log(`  - Already selected (skipped): ${skippedCount}`);
            console.log(`  - Empty paths (skipped): ${emptyPathCount}`);
            console.log(`  - Final directSelected size: ${directSelected.size}`);
            console.log(`  - directSelected contents:`, Array.from(directSelected));
            
            updateDirectCounter();
            console.log(`✅ CTRL+A completed. updateDirectCounter() called.`);
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
        
        // Setup UI elements
        setupExistingNotificationBar();
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