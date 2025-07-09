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
    
    /* 🔧 FIX LAYOUT PRIORITY - Ensure name column ALWAYS visible for ALL file items */
    .file-item {
        grid-template-columns: minmax(250px, 1fr) 150px 120px 100px 40px !important;
    }
    
    /* Force name column container to never shrink */
    .file-item .flex.items-center.gap-2.truncate {
        min-width: 200px !important;
        flex-shrink: 0 !important;
        max-width: none !important;
    }
    
    /* Force name column to stay visible on small screens */
    @media (max-width: 768px) {
        .file-item {
            grid-template-columns: minmax(200px, 2fr) 120px 100px 80px 40px !important;
        }
    }
    
    /* Ensure file name text is always visible for ALL items */
    .file-item .file-name,
    .file-item .text-sm.text-gray-900.truncate {
        min-width: 150px !important;
        overflow: visible !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
    }
    
    /* Additional fixes for selected items to override any conflicting styles */
    .direct-selected {
        grid-template-columns: minmax(250px, 1fr) 150px 120px 100px 40px !important;
    }
    
    /* 🎯 CRITICAL: Ensure notification bar is ALWAYS visible when needed */
    #selection-notification-bar {
        position: relative !important;
        z-index: 100 !important;
        display: none !important; /* Default hidden, JS will control visibility */
        width: 100% !important;
        margin-bottom: 16px !important;
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
        border: 2px solid #2196f3 !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
        animation: slideDown 0.3s ease-out !important;
    }
    
    /* 🎯 Ensure all action buttons are properly styled and visible */
    #selection-notification-bar .action-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 8px 16px !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        cursor: pointer !important;
        border: none !important;
        min-height: 36px !important;
    }
    
    /* 🎯 BATAL button specific styling - make it clearly visible */
    #cancel-select-btn {
        background: #f5f5f5 !important;
        color: #333 !important;
        border: 1px solid #ddd !important;
    }
    
    #cancel-select-btn:hover:not(.disabled) {
        background: #eeeeee !important;
        border-color: #bbb !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
    }
    
    /* 🎯 Move and Delete button styling */
    #move-selected-btn {
        background: #1976d2 !important;
        color: white !important;
    }
    
    #move-selected-btn:hover:not(.disabled) {
        background: #1565c0 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3) !important;
    }
    
    #delete-selected-btn {
        background: #d32f2f !important;
        color: white !important;
    }
    
    #delete-selected-btn:hover:not(.disabled) {
        background: #c62828 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(211, 47, 47, 0.3) !important;
    }
    
    /* 🎯 Disabled state for all buttons */
    #selection-notification-bar .action-btn.disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
        transform: none !important;
    }
    
    /* 🎯 Animation for notification bar appearance */
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* 🎯 Force notification bar to show when JS sets display: block */
    #selection-notification-bar[style*="display: block"],
    #selection-notification-bar[style*="display:block"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    /* 🎯 Force notification bar to hide when JS sets display: none */
    #selection-notification-bar[style*="display: none"],
    #selection-notification-bar[style*="display:none"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
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
    
    console.log('\n🔍 BUTTON DETECTION:');
    console.log(`  - Move button (#move-selected-btn): ${!!moveBtn}`);
    console.log(`  - Delete button (#delete-selected-btn): ${!!deleteBtn}`);
    console.log(`  - ❌ CANCEL button (#cancel-select-btn): ${!!cancelBtn}`);
    
    if (moveBtn) {
        moveBtn.addEventListener('click', directMove);
        console.log('✅ Move button wired up');
    } else {
        console.warn('⚠️ Move button not found!');
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', directClear); // For now, use directClear for delete
        console.log('✅ Delete button wired up');
    } else {
        console.warn('⚠️ Delete button not found!');
    }
    
    if (cancelBtn) {
        // 🔧 ENHANCED CANCEL BUTTON SETUP with comprehensive debugging
        console.log('\n🔧 SETTING UP CANCEL BUTTON...');
        console.log(`Cancel button element:`, cancelBtn);
        console.log(`Cancel button tagName:`, cancelBtn.tagName);
        console.log(`Cancel button id:`, cancelBtn.id);
        console.log(`Cancel button classes:`, cancelBtn.className);
        
        // Remove any existing event listeners by cloning
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        // Add enhanced event listener with debugging
        newCancelBtn.addEventListener('click', function(e) {
            console.log('\n🚨🚨🚨 CANCEL BUTTON CLICKED!');
            console.log('Event object:', e);
            console.log('Target element:', e.target);
            console.log('Current directSelected.size before clear:', directSelected.size);
            console.log('Current selected elements before clear:', document.querySelectorAll('.direct-selected').length);
            
            // Prevent any event bubbling or default behavior
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('🎯 About to call directClearViaToggle() (Same approach as CTRL+Click)...');
            
            // 🔑 KEY FIX: Use directClearViaToggle() instead of directClear()
            // This ensures identical behavior to CTRL+Click deselection
            const startTime = Date.now();
            directClearViaToggle();
            const endTime = Date.now();
            
            console.log(`🕐 directClearViaToggle() completed in ${endTime - startTime}ms`);
            console.log('🔍 Post-clear verification:');
            console.log(`  - directSelected.size: ${directSelected.size}`);
            console.log(`  - Elements with .direct-selected: ${document.querySelectorAll('.direct-selected').length}`);
            
            return false;
        }, true);
        
        console.log('✅✅✅ ENHANCED Cancel button wired up with comprehensive debugging');
    } else {
        console.error('❌❌❌ CRITICAL: Cancel button (#cancel-select-btn) NOT FOUND!');
        console.error('This explains why the cancel button doesn\'t work!');
        
        // Try to find similar buttons for debugging
        const possibleCancelBtns = document.querySelectorAll('[id*="cancel"], [class*="cancel"], [data-action="cancel"]');
        console.log(`🔍 Found ${possibleCancelBtns.length} possible cancel buttons:`, possibleCancelBtns);
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

// 🎯 NEW APPROACH: Clear via directSelect() toggle - same as CTRL+Click behavior
window.directClearViaToggle = function() {
    console.log('\n🎯🎯🎯 CLEAR VIA TOGGLE (Same as CTRL+Click) - Starting...');
    console.log(`📊 Before clear: ${directSelected.size} items selected`);
    console.log(`🎨 Before clear: ${document.querySelectorAll('.direct-selected').length} visually selected elements`);
    
    // 🔑 KEY INSIGHT: Use directSelect() to toggle off each selected element
    // This ensures identical behavior to CTRL+Click deselection
    
    const selectedElements = document.querySelectorAll('.file-item.direct-selected, [data-name].direct-selected');
    console.log(`🔍 Found ${selectedElements.length} visually selected elements to toggle off`);
    
    if (selectedElements.length === 0) {
        console.log('✅ No visually selected elements found - nothing to clear');
        // Still clear the Set just in case
        directSelected.clear();
        updateDirectCounter();
        return;
    }
    
    // Process each selected element using directSelect() toggle
    selectedElements.forEach((el, index) => {
        const fileName = el.getAttribute('data-name') || 'unknown';
        console.log(`🔄 Toggling off element ${index + 1}/${selectedElements.length}: "${fileName}"`);
        
        // Call directSelect() which will toggle the element OFF (since it's currently selected)
        directSelect(el);
    });
    
    console.log(`✅✅✅ CLEAR VIA TOGGLE completed - processed ${selectedElements.length} elements`);
    
    // Final verification
    const remainingSelected = document.querySelectorAll('.direct-selected');
    console.log(`🔍 Final verification: ${remainingSelected.length} elements still selected`);
    console.log(`📦 Final directSelected.size: ${directSelected.size}`);
    
    if (remainingSelected.length > 0 || directSelected.size > 0) {
        console.warn('⚠️ Some elements might still be selected - this should not happen');
        console.log('Remaining selected elements:', remainingSelected);
        console.log('Remaining directSelected contents:', Array.from(directSelected));
    }
};

// 🔧 LEGACY directClear function (kept for fallback)
window.directClear = function() {
    console.log('\n🧹🧹🧹 TOTAL CLEAR - Clearing all selections...');
    console.log(`📊 Before clear: ${directSelected.size} items selected`);
    console.log(`🎨 Before clear: ${document.querySelectorAll('.direct-selected').length} visually selected elements`);
    
    // 🔥 AGGRESSIVE CLEARING - Multiple approaches to ensure complete reset
    
    // Method 1: Clear using current directSelected Set
    if (directSelected.size > 0) {
        console.log('🔥 Method 1: Clearing via directSelected Set...');
        Array.from(directSelected).forEach((path, index) => {
            console.log(`🔧 Processing selected path ${index + 1}: "${path}"`);
            
            // Find elements by various selectors
            const possibleElements = [
                ...document.querySelectorAll(`[data-name="${path}"]`),
                ...document.querySelectorAll(`[data-path="${path}"]`),
                ...document.querySelectorAll(`[data-id="${path}"]`)
            ];
            
            possibleElements.forEach(el => {
                if (el.classList.contains('direct-selected')) {
                    console.log(`🧹 Clearing element: ${el.getAttribute('data-name') || 'unknown'}`);
                    clearElementSelection(el);
                }
            });
        });
    }
    
    // Method 2: Clear all elements with .direct-selected class (safety net)
    console.log('🔥 Method 2: Clearing via .direct-selected class...');
    const selectedElements = document.querySelectorAll('.direct-selected');
    selectedElements.forEach((el, index) => {
        const fileName = el.getAttribute('data-name') || 'unknown';
        console.log(`🧹 Force clearing element ${index + 1}: ${fileName}`);
        clearElementSelection(el);
    });
    
    // Method 3: Nuclear option - scan ALL file items for any remaining selection artifacts
    console.log('🔥 Method 3: Nuclear scan of all file items...');
    const allFileItems = document.querySelectorAll('.file-item, [data-name]');
    allFileItems.forEach((el, index) => {
        if (el.classList.contains('direct-selected') || 
            el.style.backgroundColor || 
            el.style.border || 
            el.style.boxShadow) {
            console.log(`☢️ Nuclear clear on element ${index + 1}: ${el.getAttribute('data-name') || 'unknown'}`);
            clearElementSelection(el);
        }
    });
    
    // Clear the Set
    directSelected.clear();
    console.log(`📦 directSelected cleared, size now: ${directSelected.size}`);
    
    // Update UI counter and notification
    updateDirectCounter();
    
    // Final verification with enhanced logging
    const remainingSelected = document.querySelectorAll('.direct-selected');
    const remainingStyles = document.querySelectorAll('[style*="background"], [style*="border"], [style*="box-shadow"]');
    
    console.log(`\n🔍 FINAL VERIFICATION:`);
    console.log(`  - Elements with .direct-selected: ${remainingSelected.length}`);
    console.log(`  - Elements with selection styles: ${remainingStyles.length}`);
    console.log(`  - directSelected.size: ${directSelected.size}`);
    
    if (remainingSelected.length > 0 || remainingStyles.length > 0) {
        console.warn('⚠️ STILL HAVE SELECTED ELEMENTS - Final cleanup...');
        [...remainingSelected, ...remainingStyles].forEach((el, i) => {
            console.log(`🔧 Emergency clear on element ${i + 1}`);
            clearElementSelection(el);
        });
    }
    
    console.log('✅✅✅ TOTAL CLEAR completed successfully');
};

// Helper function for thorough element clearing
function clearElementSelection(el) {
    if (!el) return;
    
    // Remove the class
    el.classList.remove('direct-selected');
    
    // Clear ALL possible inline styles
    const stylesToClear = [
        'backgroundColor', 'background', 'background-color',
        'border', 'borderRadius', 'border-radius',
        'boxShadow', 'box-shadow', 'transform',
        'gridTemplateColumns', 'grid-template-columns',
        'width', 'minWidth', 'min-width', 'maxWidth', 'max-width',
        'flexShrink', 'flex-shrink', 'overflow', 'whiteSpace', 'white-space',
        'position', 'zIndex', 'z-index'
    ];
    
    stylesToClear.forEach(prop => {
        el.style[prop] = '';
        el.style.removeProperty(prop);
        el.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    });
    
    // Force remove any remaining style attribute if it's empty
    if (!el.style.cssText || el.style.cssText.trim() === '') {
        el.removeAttribute('style');
    }
    
    // Remove any data attributes related to selection
    el.removeAttribute('data-selected');
    el.removeAttribute('data-direct-selected');
}

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
    console.log(`\n🔄🔄🔄 updateDirectCounter() called`);
    console.log(`📊 directSelected.size: ${count}`);
    console.log(`📦 directSelected contents:`, Array.from(directSelected));
    
    // Use existing notification bar elements from HTML
    const headerCounter = document.getElementById('selected-count-header');
    const notificationBar = document.getElementById('selection-notification-bar');
    const moveBtn = document.getElementById('move-selected-btn');
    const deleteBtn = document.getElementById('delete-selected-btn');
    const cancelBtn = document.getElementById('cancel-select-btn'); // ← TOMBOL BATAL!
    
    console.log(`\n🎯 ELEMENT DETECTION:`);
    console.log(`  - Header counter found:`, !!headerCounter);
    console.log(`  - Notification bar found:`, !!notificationBar);
    console.log(`  - Move button found:`, !!moveBtn);
    console.log(`  - Delete button found:`, !!deleteBtn);
    console.log(`  - ❌ CANCEL button found:`, !!cancelBtn); // ← PENTING!
    
    // Update header counter
    if (headerCounter) {
        headerCounter.textContent = count;
        console.log(`📝 Header counter updated to: "${count}"`);
    } else {
        console.warn('⚠️ Header counter element not found!');
    }
    
    // 🎯 CRITICAL: Show/Hide notification bar based on selection count
    if (notificationBar) {
        const shouldShow = count > 0;
        
        console.log(`\n👁️ NOTIFICATION BAR UPDATE:`);
        console.log(`  - Should show: ${shouldShow}`);
        console.log(`  - Before display: "${notificationBar.style.display}"`);
        
        if (shouldShow) {
            // ✅ SHOW the notification bar with all buttons
            notificationBar.style.display = 'block';
            notificationBar.style.visibility = 'visible';
            notificationBar.style.opacity = '1';
            
            // Enable all buttons
            if (moveBtn) {
                moveBtn.disabled = false;
                moveBtn.classList.remove('disabled');
                console.log(`✅ Move button ENABLED`);
            }
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.classList.remove('disabled');
                console.log(`✅ Delete button ENABLED`);
            }
            if (cancelBtn) {
                cancelBtn.disabled = false;
                cancelBtn.classList.remove('disabled');
                console.log(`✅ ❌ CANCEL button ENABLED - READY TO USE!`);
            }
            
            console.log(`✅ Notification bar VISIBLE with ${count} items selected`);
        } else {
            // ❌ HIDE the notification bar
            notificationBar.style.display = 'none';
            notificationBar.style.visibility = 'hidden';
            notificationBar.style.opacity = '0';
            
            // Disable all buttons
            if (moveBtn) {
                moveBtn.disabled = true;
                moveBtn.classList.add('disabled');
            }
            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.classList.add('disabled');
            }
            if (cancelBtn) {
                cancelBtn.disabled = true;
                cancelBtn.classList.add('disabled');
            }
            
            console.log(`❌ Notification bar HIDDEN - no selection`);
        }
        
        console.log(`  - After display: "${notificationBar.style.display}"`);
        console.log(`  - After visibility: "${notificationBar.style.visibility}"`);
        console.log(`  - After opacity: "${notificationBar.style.opacity}"`);
        
    } else {
        console.error('❌❌❌ CRITICAL: Notification bar element NOT FOUND!');
        console.error('❌ Cannot show Batal button - #selection-notification-bar missing');
    }
    
    console.log(`\n✅✅✅ updateDirectCounter() completed`);
    console.log(`📊 Final state: ${count > 0 ? 'BUTTONS SHOULD BE VISIBLE' : 'BUTTONS SHOULD BE HIDDEN'}`);
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

// Attach context menu and CTRL+Click listeners to all file items
function attachContextListeners() {
    console.log('🔗 Attaching context menu and CTRL+Click listeners...');
    
    // First, analyze DOM structure for debugging
    debugDOMStructure();
    
    document.querySelectorAll('.file-item, [data-name]').forEach(item => {
        // Clone node to remove existing event listeners
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // 🖱️ Add CTRL+Click listener for multi-select
        newItem.addEventListener('click', function(e) {
            // Only trigger on CTRL+Click
            if (e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                console.log('🖱️ CTRL+Click detected on:', newItem.getAttribute('data-name'));
                
                // Hide any open context menus
                hideDirectMenu();
                
                // Toggle selection on this item
                directSelect(newItem);
                
                return false;
            }
            
            // For non-CTRL clicks, let other handlers process normally
        }, true);
        
        // 🖱️ Add context menu listener (right-click)
        newItem.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('🖱️ Right-click detected on:', newItem.getAttribute('data-name'));
            
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
        
        console.log('📁 CTRL+Click & Context menu attached to:', newItem.getAttribute('data-name'));
    });
    
    console.log('✅ Context menu and CTRL+Click listeners attached to all file items');
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
            console.log('⌨️ ESC pressed - using directClearViaToggle() for consistency...');
            window.directClearViaToggle();
            hideDirectMenu();
            console.log('✅ ESC: Cleared all selections via toggle method');
            return;
        }
    });
    
    console.log('✅ Keyboard shortcuts setup (CTRL+A, ESC)');
}

// 🧪 DEBUG: Function to manually test notification bar
window.testNotificationBar = function() {
    console.log('\n🧪 TESTING NOTIFICATION BAR...');
    
    const notificationBar = document.getElementById('selection-notification-bar');
    const cancelBtn = document.getElementById('cancel-select-btn');
    
    console.log('Notification bar found:', !!notificationBar);
    console.log('Cancel button found:', !!cancelBtn);
    
    if (notificationBar) {
        console.log('Current display:', notificationBar.style.display);
        console.log('Current visibility:', notificationBar.style.visibility);
        
        // Force show for 3 seconds
        notificationBar.style.display = 'block';
        notificationBar.style.visibility = 'visible';
        notificationBar.style.opacity = '1';
        
        console.log('✅ Forced notification bar visible for 3 seconds');
        
        setTimeout(() => {
            notificationBar.style.display = 'none';
            console.log('❌ Hidden notification bar after test');
        }, 3000);
    }
};

// 🧪 DEBUG: Function to manually trigger updateDirectCounter
window.debugUpdateCounter = function() {
    console.log('\n🧪 MANUAL TRIGGER updateDirectCounter...');
    updateDirectCounter();
};

// 🧪 DEBUG: Function to manually test cancel button
window.testCancelButton = function() {
    console.log('\n🧪 TESTING CANCEL BUTTON...');
    
    const cancelBtn = document.getElementById('cancel-select-btn');
    console.log('Cancel button found:', !!cancelBtn);
    
    if (cancelBtn) {
        console.log('Cancel button element:', cancelBtn);
        console.log('Cancel button click handler count:', getEventListeners ? getEventListeners(cancelBtn).click?.length || 0 : 'Cannot detect');
        
        console.log('🔄 Simulating cancel button click...');
        cancelBtn.click();
        console.log('✅ Cancel button click simulated');
    } else {
        console.error('❌ Cancel button not found! This is the problem.');
    }
};

// 🧪 DEBUG: Function to test new toggle approach directly
window.testToggleClear = function() {
    console.log('\n🧪 TESTING NEW TOGGLE CLEAR APPROACH...');
    
    // First, select some files via CTRL+A simulation
    console.log('📋 Step 1: Simulating CTRL+A selection...');
    const allElements = document.querySelectorAll('.file-item, [data-name]');
    allElements.forEach(item => {
        const path = normalizePath(item);
        if (path) {
            directSelected.add(path);
            item.classList.add('direct-selected');
        }
    });
    updateDirectCounter();
    
    const beforeToggle = {
        setSize: directSelected.size,
        visualElements: document.querySelectorAll('.direct-selected').length
    };
    
    console.log(`✅ Selected ${beforeToggle.setSize} files via CTRL+A simulation`);
    console.log(`🎨 Visual elements: ${beforeToggle.visualElements}`);
    
    console.log('\n📋 Step 2: Testing directClearViaToggle()...');
    directClearViaToggle();
    
    const afterToggle = {
        setSize: directSelected.size,
        visualElements: document.querySelectorAll('.direct-selected').length
    };
    
    console.log('📊 Toggle Clear Results:');
    console.log(`  Before: Set=${beforeToggle.setSize}, Visual=${beforeToggle.visualElements}`);
    console.log(`  After:  Set=${afterToggle.setSize}, Visual=${afterToggle.visualElements}`);
    console.log(`  Success: ${afterToggle.setSize === 0 && afterToggle.visualElements === 0 ? '✅ PERFECT!' : '❌ FAILED'}`);
};

// 🧪 DEBUG: Compare ESC vs Cancel Button behavior
window.compareClearMethods = function() {
    console.log('\n🧪 COMPARING CLEAR METHODS...');
    
    // First, select some files via CTRL+A simulation
    console.log('📋 Step 1: Simulating CTRL+A selection...');
    const allElements = document.querySelectorAll('.file-item, [data-name]');
    allElements.forEach(item => {
        const path = normalizePath(item);
        if (path) {
            directSelected.add(path);
            item.classList.add('direct-selected');
        }
    });
    updateDirectCounter();
    
    console.log(`✅ Selected ${directSelected.size} files via simulation`);
    console.log(`🎨 Visual elements with .direct-selected: ${document.querySelectorAll('.direct-selected').length}`);
    
    console.log('\n📋 Step 2: Testing ESC method...');
    const beforeESC = {
        setSize: directSelected.size,
        visualElements: document.querySelectorAll('.direct-selected').length
    };
    
    // Simulate ESC (which now uses directClearViaToggle)
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(escEvent);
    
    const afterESC = {
        setSize: directSelected.size,
        visualElements: document.querySelectorAll('.direct-selected').length
    };
    
    console.log('📊 ESC Results:');
    console.log(`  Before: Set=${beforeESC.setSize}, Visual=${beforeESC.visualElements}`);
    console.log(`  After:  Set=${afterESC.setSize}, Visual=${afterESC.visualElements}`);
    console.log(`  Success: ${afterESC.setSize === 0 && afterESC.visualElements === 0 ? '✅' : '❌'}`);
    
    // Re-select for cancel button test
    console.log('\n📋 Step 3: Re-selecting for Cancel Button test...');
    allElements.forEach(item => {
        const path = normalizePath(item);
        if (path) {
            directSelected.add(path);
            item.classList.add('direct-selected');
        }
    });
    updateDirectCounter();
    
    const beforeCancel = {
        setSize: directSelected.size,
        visualElements: document.querySelectorAll('.direct-selected').length
    };
    
    console.log('\n📋 Step 4: Testing Cancel Button method...');
    testCancelButton();
    
    const afterCancel = {
        setSize: directSelected.size,
        visualElements: document.querySelectorAll('.direct-selected').length
    };
    
    console.log('📊 Cancel Button Results:');
    console.log(`  Before: Set=${beforeCancel.setSize}, Visual=${beforeCancel.visualElements}`);
    console.log(`  After:  Set=${afterCancel.setSize}, Visual=${afterCancel.visualElements}`);
    console.log(`  Success: ${afterCancel.setSize === 0 && afterCancel.visualElements === 0 ? '✅' : '❌'}`);
    
    console.log('\n🏁 COMPARISON SUMMARY:');
    console.log(`  ESC Success: ${afterESC.setSize === 0 && afterESC.visualElements === 0 ? '✅' : '❌'}`);
    console.log(`  Cancel Button Success: ${afterCancel.setSize === 0 && afterCancel.visualElements === 0 ? '✅' : '❌'}`);
};

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
        window.directClearViaToggle = window.directClearViaToggle; // 🎯 NEW: Toggle-based clear
        window.directMove = window.directMove;
        window.hideDirectMenu = hideDirectMenu;
        
        console.log('✅ Direct Selection System initialized successfully!');
        console.log('📖 Usage:');
        console.log('   🖱️  Right-click file → Context menu');
        console.log('   🖱️  CTRL+Click file → Toggle selection (multi-select)');
        console.log('   ⌨️  CTRL+A → Select all files');
        console.log('   ⌨️  ESC → Clear all selections');
        console.log('   ❌  Click "Batal" button → Clear all selections');
        console.log('\n🧪 Debug Functions:');
        console.log('   testNotificationBar() → Test notification bar visibility');
        console.log('   testCancelButton() → Test cancel button functionality');
        console.log('   testToggleClear() → Test NEW toggle clear approach (CTRL+A fix)');
        console.log('   compareClearMethods() → Compare ESC vs Cancel button');
        console.log('   debugUpdateCounter() → Manual trigger counter update');
        console.log('\n🎯 Core Functions:');
        console.log('   directClearViaToggle() → NEW: Clear using directSelect() toggle');
        console.log('   directClear() → LEGACY: Old clear method');
        
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