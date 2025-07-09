// 🛠️ MANUAL SELECTION FIX - Force selection to work
console.log('🔧 Loading manual selection fix...');

// Global variables
let manualSelectedFiles = new Set();
let manualSelectionMode = false;

// Force CSS injection
function injectSelectionCSS() {
    const style = document.createElement('style');
    style.id = 'manual-selection-css';
    style.innerHTML = `
        .manual-selected {
            background-color: #c2e7ff !important;
            border: 2px solid #1a73e8 !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3) !important;
            transform: translateY(-1px) !important;
            transition: all 0.2s ease !important;
        }
        
        .manual-checkbox {
            appearance: none !important;
            width: 18px !important;
            height: 18px !important;
            border: 2px solid #dadce0 !important;
            border-radius: 3px !important;
            cursor: pointer !important;
            position: relative !important;
            background: white !important;
            margin-right: 8px !important;
        }
        
        .manual-checkbox:checked {
            background-color: #1a73e8 !important;
            border-color: #1a73e8 !important;
        }
        
        .manual-checkbox:checked::after {
            content: '✓' !important;
            position: absolute !important;
            top: -1px !important;
            left: 2px !important;
            color: white !important;
            font-size: 12px !important;
            font-weight: bold !important;
        }
        
        #manual-notification-bar {
            position: fixed !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
            border: 2px solid #2196f3 !important;
            border-radius: 12px !important;
            padding: 12px 20px !important;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
            z-index: 10000 !important;
            display: none !important;
            font-weight: 600 !important;
            color: #1565c0 !important;
        }
        
        .manual-action-btn {
            background: #1976d2 !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            margin: 0 4px !important;
            cursor: pointer !important;
            font-weight: 600 !important;
        }
        
        .manual-action-btn:hover {
            background: #1565c0 !important;
        }
        
        .manual-action-btn.cancel {
            background: #f44336 !important;
        }
        
        .manual-action-btn.cancel:hover {
            background: #d32f2f !important;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Manual selection CSS injected');
}

// Create notification bar
function createNotificationBar() {
    let notificationBar = document.getElementById('manual-notification-bar');
    if (!notificationBar) {
        notificationBar = document.createElement('div');
        notificationBar.id = 'manual-notification-bar';
        notificationBar.innerHTML = `
            <span id="manual-count-text">0 item dipilih</span>
            <button class="manual-action-btn" onclick="manualMoveFiles()">Pindahkan</button>
            <button class="manual-action-btn" onclick="manualDeleteFiles()">Hapus</button>
            <button class="manual-action-btn cancel" onclick="manualCancelSelection()">Batal</button>
        `;
        document.body.appendChild(notificationBar);
        console.log('✅ Manual notification bar created');
    }
    return notificationBar;
}

// Manual selection function
function manualSelectFile(fileElement) {
    console.log('🎯 Manual select file:', fileElement.getAttribute('data-name'));
    
    const fileId = fileElement.getAttribute('data-path') || fileElement.getAttribute('data-name');
    
    // Toggle selection
    if (manualSelectedFiles.has(fileId)) {
        // Deselect
        manualSelectedFiles.delete(fileId);
        fileElement.classList.remove('manual-selected');
        
        // Remove checkbox if exists
        const checkbox = fileElement.querySelector('.manual-checkbox');
        if (checkbox) {
            checkbox.checked = false;
        }
        
        console.log('❌ Deselected:', fileId);
    } else {
        // Select
        manualSelectedFiles.add(fileId);
        fileElement.classList.add('manual-selected');
        
        // Add checkbox if doesn't exist
        let checkbox = fileElement.querySelector('.manual-checkbox');
        if (!checkbox) {
            checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'manual-checkbox';
            fileElement.insertBefore(checkbox, fileElement.firstChild);
        }
        checkbox.checked = true;
        
        console.log('✅ Selected:', fileId);
    }
    
    // Update UI
    updateManualNotification();
    
    // Enter selection mode if not already
    if (!manualSelectionMode && manualSelectedFiles.size > 0) {
        manualSelectionMode = true;
        document.body.classList.add('manual-selection-mode');
        console.log('⚡ Entered manual selection mode');
    }
}

// Update notification
function updateManualNotification() {
    const count = manualSelectedFiles.size;
    const countText = document.getElementById('manual-count-text');
    const notificationBar = document.getElementById('manual-notification-bar');
    
    if (countText) {
        countText.textContent = `${count} item dipilih`;
    }
    
    if (notificationBar) {
        if (count > 0) {
            notificationBar.style.display = 'block';
        } else {
            notificationBar.style.display = 'none';
        }
    }
    
    console.log('📊 Updated notification:', count, 'items selected');
}

// Cancel selection
function manualCancelSelection() {
    console.log('🚪 Manual cancel selection');
    
    // Remove all selections
    document.querySelectorAll('.manual-selected').forEach(item => {
        item.classList.remove('manual-selected');
    });
    
    // Remove all checkboxes
    document.querySelectorAll('.manual-checkbox').forEach(cb => cb.remove());
    
    // Clear state
    manualSelectedFiles.clear();
    manualSelectionMode = false;
    document.body.classList.remove('manual-selection-mode');
    
    // Hide notification
    updateManualNotification();
    
    console.log('✅ Manual selection cancelled');
}

// Move files (placeholder)
function manualMoveFiles() {
    if (manualSelectedFiles.size === 0) return;
    
    alert(`📁 Akan memindahkan ${manualSelectedFiles.size} file:\n${Array.from(manualSelectedFiles).join('\n')}`);
    console.log('📁 Move files:', Array.from(manualSelectedFiles));
}

// Delete files (placeholder)
function manualDeleteFiles() {
    if (manualSelectedFiles.size === 0) return;
    
    if (confirm(`🗑️ Yakin ingin menghapus ${manualSelectedFiles.size} file?`)) {
        alert(`🗑️ Akan menghapus ${manualSelectedFiles.size} file:\n${Array.from(manualSelectedFiles).join('\n')}`);
        console.log('🗑️ Delete files:', Array.from(manualSelectedFiles));
        manualCancelSelection();
    }
}

// Override context menu to use manual selection
function setupManualContextMenu() {
    // Remove existing event listeners by cloning elements
    document.querySelectorAll('.file-item').forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Add new context menu listener
        newItem.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            const fileName = newItem.getAttribute('data-name');
            const fileType = newItem.getAttribute('data-type');
            
            // Create simple context menu
            const existingMenu = document.getElementById('manual-context-menu');
            if (existingMenu) existingMenu.remove();
            
            const menu = document.createElement('div');
            menu.id = 'manual-context-menu';
            menu.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10001;
                min-width: 160px;
                padding: 8px 0;
                font-family: Arial, sans-serif;
            `;
            
            menu.innerHTML = `
                <div style="padding: 8px 16px; cursor: pointer; hover:background-color: #f5f5f5;" onclick="manualSelectFile(document.querySelector('[data-name=\\'${fileName}\\']')); document.getElementById('manual-context-menu').remove();">
                    ☑️ Pilih
                </div>
                <div style="padding: 8px 16px; cursor: pointer;" onclick="document.getElementById('manual-context-menu').remove();">
                    📂 ${fileType === 'folder' ? 'Buka Folder' : 'Buka File'}
                </div>
                <div style="padding: 8px 16px; cursor: pointer;" onclick="document.getElementById('manual-context-menu').remove();">
                    ✏️ Ganti Nama
                </div>
            `;
            
            document.body.appendChild(menu);
            
            // Remove menu when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function removeMenu() {
                    menu.remove();
                    document.removeEventListener('click', removeMenu);
                }, 100);
            });
        });
    });
    
    console.log('✅ Manual context menu setup completed');
}

// Initialize manual selection system
function initManualSelection() {
    console.log('🚀 Initializing manual selection system...');
    
    injectSelectionCSS();
    createNotificationBar();
    setupManualContextMenu();
    
    // Expose functions globally
    window.manualSelectFile = manualSelectFile;
    window.manualCancelSelection = manualCancelSelection;
    window.manualMoveFiles = manualMoveFiles;
    window.manualDeleteFiles = manualDeleteFiles;
    
    console.log('✅ Manual selection system ready!');
    console.log('💡 Right-click any file/folder and select "Pilih"');
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManualSelection);
} else {
    initManualSelection();
}

console.log('🎉 Manual selection fix script loaded!');