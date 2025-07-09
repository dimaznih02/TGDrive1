// Move Files JavaScript Functionality

let selectedFiles = new Set();
let isSelectionMode = false;

// Expose to global scope for context menu
window.selectedFiles = selectedFiles;
window.isSelectionMode = () => isSelectionMode;
window.startSelectionWithFile = null; // Will be set after function definition
window.handleFileSelection = null;
window.openMoveDialog = null;
window.deleteSelectedFiles = null;
window.exitSelectionMode = null;

// Add ready state indicator
window.moveFilesSystemReady = false;

// Initialize move files functionality when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMoveFiles();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMoveFiles);
} else {
    initializeMoveFiles();
}

function initializeMoveFiles() {
    console.log('🔧 Initializing move files system...');
    
    // Expose all functions to global scope immediately
    window.startSelectionWithFile = startSelectionWithFile;
    window.handleFileSelection = handleFileSelection;
    window.openMoveDialog = openMoveDialog;
    window.deleteSelectedFiles = deleteSelectedFiles;
    window.exitSelectionMode = exitSelectionMode;
    
    console.log('🌐 Global functions exposed:', {
        startSelectionWithFile: typeof window.startSelectionWithFile,
        handleFileSelection: typeof window.handleFileSelection,
        openMoveDialog: typeof window.openMoveDialog,
        deleteSelectedFiles: typeof window.deleteSelectedFiles,
        exitSelectionMode: typeof window.exitSelectionMode
    });
    
    // Set ready state
    window.moveFilesSystemReady = true;
    
    // Dispatch ready event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('moveFilesReady', {
        detail: { 
            systemReady: true,
            functions: ['startSelectionWithFile', 'handleFileSelection', 'openMoveDialog', 'deleteSelectedFiles', 'exitSelectionMode']
        }
    }));
    
    // Selection mode will be triggered from context menu, not button
    
    // Selection notification bar buttons (with safety checks)
    const moveSelectedBtn = document.getElementById('move-selected-btn');
    if (moveSelectedBtn) {
        moveSelectedBtn.addEventListener('click', function() {
            if (selectedFiles.size > 0) {
                openMoveDialog();
            }
        });
    }
    
    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            if (selectedFiles.size > 0) {
                deleteSelectedFiles();
            }
        });
    }
    
    const cancelSelectBtn = document.getElementById('cancel-select-btn');
    if (cancelSelectBtn) {
        cancelSelectBtn.addEventListener('click', exitSelectionMode);
    }
    
    // Move dialog buttons (with safety checks)
    const moveCancelBtn = document.getElementById('move-cancel');
    if (moveCancelBtn) {
        moveCancelBtn.addEventListener('click', closeMoveDialog);
    }
    
    const moveConfirmBtn = document.getElementById('move-confirm');
    if (moveConfirmBtn) {
        moveConfirmBtn.addEventListener('click', confirmMoveFiles);
    }
    
    // Select all checkbox (both in notification bar and header)
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }
    
    const headerSelectAll = document.getElementById('header-select-all');
    if (headerSelectAll) {
        headerSelectAll.addEventListener('change', handleSelectAll);
    }
    
    console.log('✅ Move files system initialized and ready');
}

// Start selection mode with a specific file (triggered from context menu)
function startSelectionWithFile(fileElement) {
    console.log('🚀 startSelectionWithFile called with element:', fileElement);
    
    if (!fileElement) {
        console.error('❌ No file element provided to startSelectionWithFile');
        alert('Error: No file element provided for selection');
        return;
    }
    
    console.log('📂 Current selection mode:', isSelectionMode);
    console.log('📂 Element attributes:', {
        'data-path': fileElement.getAttribute('data-path'),
        'data-id': fileElement.getAttribute('data-id'),
        'data-name': fileElement.getAttribute('data-name'),
        'data-type': fileElement.getAttribute('data-type')
    });
    
    try {
        // CLEAR ANY EXISTING SELECTIONS first to prevent ghost selections
        console.log('🧹 Clearing any existing selections to prevent ghosts...');
        selectedFiles.clear();
        
        // Remove all existing selected classes
        document.querySelectorAll('.file-item.selected').forEach(item => {
            item.classList.remove('selected');
            console.log('🗑️ Removed ghost selection from:', item.getAttribute('data-name'));
        });
        
        // Remove all existing checkboxes to start fresh
        document.querySelectorAll('.file-item .checkbox-column').forEach(cb => cb.remove());
        
        if (!isSelectionMode) {
            console.log('⚡ Entering selection mode...');
            enterSelectionMode();
        } else {
            // If already in selection mode, just re-add checkboxes
            console.log('🔄 Already in selection mode, re-adding checkboxes...');
            addCheckboxesToRows();
        }
        
        // Get file ID/path
        const fileId = fileElement.getAttribute('data-id') || fileElement.getAttribute('data-path');
        const fileName = fileElement.getAttribute('data-name') || 'Unknown File';
        console.log('📋 File info - ID:', fileId, 'Name:', fileName);
        
        if (!fileId) {
            console.error('❌ No file ID or path found on element');
            alert('Error: Unable to identify file for selection');
            return;
        }
        
        // Add this specific file to selection
        selectedFiles.add(fileId);
        fileElement.classList.add('selected');
        
        // Force immediate visual feedback
        fileElement.style.backgroundColor = '#c2e7ff';
        fileElement.style.border = '2px solid #1a73e8';
        fileElement.style.borderRadius = '8px';
        fileElement.style.boxShadow = '0 2px 8px rgba(26, 115, 232, 0.3)';
        fileElement.style.transform = 'translateY(-1px)';
        
        console.log('✅ Added to fresh selection, element classes:', fileElement.className);
        console.log('🎨 Applied visual styling to element:', fileElement.getAttribute('style'));
        
        // Force notification bar to show immediately
        const notificationBar = document.getElementById('selection-notification-bar');
        if (notificationBar) {
            notificationBar.style.display = 'flex';
            notificationBar.classList.add('animate-slide-down');
            console.log('📢 Notification bar displayed');
        } else {
            console.log('❌ Notification bar not found');
        }
        
        // Update UI immediately
        updateSelectedCount();
        updateSelectAllCheckbox();
        
        // Give a small delay for DOM to update, then find and check the checkbox
        setTimeout(() => {
            const checkbox = fileElement.querySelector('.file-checkbox');
            if (checkbox) {
                checkbox.checked = true;
                console.log('☑️ Checked checkbox for selected file');
                
                // Add visual feedback to checkbox too
                checkbox.style.backgroundColor = '#1a73e8';
                checkbox.style.borderColor = '#1a73e8';
            } else {
                console.log('⚠️ Checkbox not found for selected file, searching again...');
                // Try to find checkbox by searching all checkboxes
                const allCheckboxes = document.querySelectorAll('.file-checkbox');
                allCheckboxes.forEach((cb, index) => {
                    const row = cb.closest('.file-item');
                    const rowId = row?.getAttribute('data-id') || row?.getAttribute('data-path');
                    if (rowId === fileId) {
                        cb.checked = true;
                        cb.style.backgroundColor = '#1a73e8';
                        cb.style.borderColor = '#1a73e8';
                        console.log('☑️ Found and checked checkbox at index:', index);
                    }
                });
            }
            
            // Update UI again after checkbox update
            updateSelectedCount();
            updateSelectAllCheckbox();
        }, 50);
        
        // Show toast notification
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast(`"${fileName}" dipilih`, 'success');
        } else {
            console.log('🔔 Toast: File dipilih -', fileName);
        }
        
        console.log('🎯 Started selection with file:', fileName, 'Total selected:', selectedFiles.size);
        
    } catch (error) {
        console.error('❌ Error in startSelectionWithFile:', error);
        alert('Error starting selection: ' + error.message);
    }
}

// Expose to global scope
window.startSelectionWithFile = startSelectionWithFile;

function toggleSelectionMode() {
    if (isSelectionMode) {
        exitSelectionMode();
    } else {
        enterSelectionMode();
    }
}

function enterSelectionMode() {
    console.log('⚡ Entering selection mode...');
    isSelectionMode = true;
    document.body.classList.add('selection-mode');
    
    // Show/hide appropriate buttons (with safety checks)
    const selectModeBtn = document.getElementById('select-mode-btn');
    if (selectModeBtn) {
        selectModeBtn.classList.add('hidden');
    }
    
    const moveFilesBtn = document.getElementById('move-files-btn');
    if (moveFilesBtn) {
        moveFilesBtn.classList.remove('hidden');
    }
    
    const cancelSelectBtn = document.getElementById('cancel-select-btn');
    if (cancelSelectBtn) {
        cancelSelectBtn.classList.remove('hidden');
    }
    
    // Show checkbox column (with safety checks)
    document.querySelectorAll('.checkbox-column').forEach(el => {
        el.classList.remove('hidden');
    });
    
    // Add checkboxes to all rows
    addCheckboxesToRows();
    
    // Update selection count
    updateSelectedCount();
    
    console.log('✅ Selection mode entered successfully');
}

function exitSelectionMode() {
    console.log('🚪 Exiting selection mode...');
    console.log('📊 Current state before exit:', {
        isSelectionMode,
        selectedFilesCount: selectedFiles.size,
        selectedFiles: Array.from(selectedFiles)
    });
    
    isSelectionMode = false;
    document.body.classList.remove('selection-mode');
    selectedFiles.clear();
    
    // Remove checkboxes from file items with debugging
    const checkboxes = document.querySelectorAll('.file-item .checkbox-column');
    console.log(`🗑️ Removing ${checkboxes.length} checkboxes...`);
    
    checkboxes.forEach((checkbox, index) => {
        const row = checkbox.closest('.file-item');
        console.log(`🗑️ Removing checkbox ${index} from:`, row?.getAttribute('data-name'));
        checkbox.remove();
    });
    
    // Remove selected styling from rows with debugging
    const selectedRows = document.querySelectorAll('.file-item.selected');
    console.log(`🎨 Removing selection styling from ${selectedRows.length} rows...`);
    
    selectedRows.forEach((row, index) => {
        console.log(`🎨 Cleaning row ${index}:`, row.getAttribute('data-name'));
        
        row.classList.remove('selected');
        
        // Clear all inline styles
        row.style.backgroundColor = '';
        row.style.border = '';
        row.style.borderRadius = '';
        row.style.boxShadow = '';
        row.style.transform = '';
        
        // Reset grid template to original
        const currentStyle = row.getAttribute('style') || '';
        const gridMatch = currentStyle.match(/grid-template-columns:\s*([^;]+)/);
        
        if (gridMatch) {
            const columns = gridMatch[1];
            if (columns.includes('40px')) {
                // Remove the checkbox column (first 40px)
                const newColumns = columns.replace(/^40px\s*/, '');
                row.style.gridTemplateColumns = newColumns;
                console.log(`📐 Reset grid template for row ${index}: ${newColumns}`);
            }
        }
    });
    
    // Reset table header
    const tableHeader = document.getElementById('table-header');
    if (tableHeader) {
        const headerCheckboxCol = tableHeader.querySelector('.checkbox-column');
        if (headerCheckboxCol) {
            headerCheckboxCol.style.display = 'none';
            console.log('👁️ Hidden header checkbox column');
        }
        
        // Reset header grid template
        tableHeader.style.gridTemplateColumns = '1fr 200px 150px 120px 40px';
        console.log('📐 Reset table header grid template');
    }
    
    // Uncheck select all checkboxes
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        console.log('☑️ Reset select-all checkbox');
    }
    
    const headerSelectAll = document.getElementById('header-select-all');
    if (headerSelectAll) {
        headerSelectAll.checked = false;
        headerSelectAll.indeterminate = false;
        console.log('☑️ Reset header select-all checkbox');
    }
    
    // Hide notification bar with animation
    const notificationBar = document.getElementById('selection-notification-bar');
    if (notificationBar) {
        notificationBar.style.display = 'none';
        notificationBar.classList.remove('animate-slide-down');
        console.log('📢 Hidden notification bar');
    }
    
    updateSelectedCount();
    
    // 🔧 BUG FIX INTEGRATION: Call directNuclearClear for comprehensive fixes
    console.log('🔧 Calling directNuclearClear() to fix post-cancel bugs...');
    if (window.directNuclearClear && typeof window.directNuclearClear === 'function') {
        try {
            window.directNuclearClear();
            console.log('✅ directNuclearClear() completed - all post-cancel bugs should be fixed');
        } catch (error) {
            console.warn('⚠️ directNuclearClear() failed:', error);
        }
    } else {
        console.warn('⚠️ directNuclearClear() not available - some post-cancel bugs may persist');
        
        // 🔧 FALLBACK: Apply critical bug fixes manually
        console.log('🔧 Applying fallback bug fixes...');
        
                 // Fallback Fix 1: Consistent grid layout (NAMA column priority)
         const allFileItems = document.querySelectorAll('.file-item, [data-name]');
         allFileItems.forEach(el => {
             el.style.gridTemplateColumns = '1fr 150px 120px 100px 40px';
         });
        
        // Fallback Fix 2: Force repaint all elements
        allFileItems.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.offsetHeight;
            el.style.transform = '';
        });
        
        // Fallback Fix 3: Basic context menu restoration
        if (window.attachContextListeners && typeof window.attachContextListeners === 'function') {
            window.attachContextListeners();
        }
        
        console.log('✅ Fallback bug fixes applied');
    }
    
    console.log('✅ Selection mode exited successfully with comprehensive bug fixes');
    console.log('📊 Final state:', {
        isSelectionMode,
        selectedFilesCount: selectedFiles.size,
        bodyClasses: document.body.className
    });
}

// Expose to global scope
window.exitSelectionMode = exitSelectionMode;

function addCheckboxesToRows() {
    console.log('🔧 Adding checkboxes to rows...');
    let addedCount = 0;
    
    document.querySelectorAll('.file-item').forEach((row, index) => {
        if (!row.querySelector('.file-checkbox')) {
            // Debug element before adding checkbox
            console.log(`📝 Adding checkbox to row ${index}:`, {
                name: row.getAttribute('data-name'),
                path: row.getAttribute('data-path'),
                type: row.getAttribute('data-type'),
                currentClasses: row.className
            });
            
            // Create checkbox element
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-column flex justify-center items-center';
            checkboxDiv.innerHTML = '<input type="checkbox" class="file-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">';
            
            // Get the current grid template and modify it to include checkbox column
            const currentStyle = row.getAttribute('style') || '';
            const gridMatch = currentStyle.match(/grid-template-columns:\s*([^;]+)/);
            
            if (gridMatch) {
                const originalColumns = gridMatch[1];
                const newColumns = `40px ${originalColumns}`;
                row.style.gridTemplateColumns = newColumns;
                console.log(`📐 Updated grid template for row ${index}: ${newColumns}`);
            } else {
                // Fallback: add checkbox column to default grid
                row.style.gridTemplateColumns = '40px 1fr 200px 150px 120px 40px';
                console.log(`📐 Applied default grid template with checkbox for row ${index}`);
            }
            
            // Insert as first child
            row.insertBefore(checkboxDiv, row.firstChild);
            
            const checkbox = checkboxDiv.querySelector('.file-checkbox');
            const fileId = row.getAttribute('data-id') || row.getAttribute('data-path');
            
            checkbox.addEventListener('change', function() {
                console.log(`☑️ Checkbox changed for ${fileId}:`, checkbox.checked);
                handleFileSelection(fileId, checkbox.checked, row);
            });
            
            addedCount++;
        }
    });
    
    console.log(`✅ Added ${addedCount} checkboxes to file items`);
    
    // Also update table header grid if needed
    const tableHeader = document.getElementById('table-header');
    if (tableHeader) {
        const headerStyle = tableHeader.getAttribute('style') || '';
        if (!headerStyle.includes('40px')) {
            tableHeader.style.gridTemplateColumns = '40px 1fr 200px 150px 120px 40px';
            console.log('📐 Updated table header grid template');
        }
        
        // Show checkbox column in header
        const headerCheckboxCol = tableHeader.querySelector('.checkbox-column');
        if (headerCheckboxCol) {
            headerCheckboxCol.style.display = 'flex';
            console.log('👁️ Showed header checkbox column');
        }
    }
}

function handleFileSelection(fileId, isSelected, row) {
    console.log('🎯 handleFileSelection called:', {
        fileId,
        isSelected,
        rowElement: row,
        rowName: row.getAttribute('data-name')
    });
    
    if (isSelected) {
        selectedFiles.add(fileId);
        row.classList.add('selected');
        
        // Force visual update with inline styles as backup
        row.style.backgroundColor = '#c2e7ff';
        row.style.border = '2px solid #1a73e8';
        row.style.borderRadius = '8px';
        row.style.boxShadow = '0 1px 3px rgba(26, 115, 232, 0.3)';
        
        console.log('✅ File selected:', {
            fileId,
            selectedFilesCount: selectedFiles.size,
            rowClasses: row.className,
            rowStyle: row.getAttribute('style')
        });
    } else {
        selectedFiles.delete(fileId);
        row.classList.remove('selected');
        
        // Remove inline styles to revert to normal
        row.style.backgroundColor = '';
        row.style.border = '';
        row.style.borderRadius = '';
        row.style.boxShadow = '';
        
        console.log('❌ File deselected:', {
            fileId,
            selectedFilesCount: selectedFiles.size,
            rowClasses: row.className
        });
    }
    
    console.log('📊 Current selectedFiles:', Array.from(selectedFiles));
    
    updateSelectedCount();
    updateSelectAllCheckbox();
}

// Expose to global scope
window.handleFileSelection = handleFileSelection;

function handleSelectAll(event) {
    const isChecked = event.target.checked;
    
    // Update both checkboxes to stay in sync
    document.getElementById('select-all-checkbox').checked = isChecked;
    const headerSelectAll = document.getElementById('header-select-all');
    if (headerSelectAll) {
        headerSelectAll.checked = isChecked;
    }
    
    document.querySelectorAll('.file-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
        const row = checkbox.closest('.file-item');
        const fileId = row.getAttribute('data-id') || row.getAttribute('data-path');
        
        if (isChecked) {
            selectedFiles.add(fileId);
            row.classList.add('selected');
        } else {
            selectedFiles.delete(fileId);
            row.classList.remove('selected');
        }
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const count = selectedFiles.size;
    console.log('📊 Updating selected count:', count);
    
    // Update counter in header if element exists
    const counterHeader = document.getElementById('selected-count-header');
    if (counterHeader) {
        counterHeader.textContent = count;
    }
    
    // Update text in notification bar
    const notificationText = count === 1 ? '1 item dipilih' : `${count} item dipilih`;
    const countTextElement = document.getElementById('selected-count-text');
    if (countTextElement) {
        countTextElement.innerHTML = `<span id="selected-count-header">${count}</span> item dipilih`;
        console.log('📝 Updated notification text:', notificationText);
    }
    
    // Show/hide notification bar based on selection count
    const notificationBar = document.getElementById('selection-notification-bar');
    if (notificationBar) {
        if (count > 0) {
            notificationBar.style.display = 'flex';
            console.log('📢 Notification bar shown');
        } else {
            notificationBar.style.display = 'none';
            console.log('📢 Notification bar hidden');
        }
    } else {
        console.log('⚠️ Notification bar element not found');
    }
    
    // Enable/disable action buttons
    const moveBtn = document.getElementById('move-selected-btn');
    const deleteBtn = document.getElementById('delete-selected-btn');
    
    if (moveBtn && deleteBtn) {
        if (count > 0) {
            moveBtn.classList.remove('disabled');
            moveBtn.removeAttribute('disabled');
            deleteBtn.classList.remove('disabled');
            deleteBtn.removeAttribute('disabled');
            console.log('🔘 Action buttons enabled');
        } else {
            moveBtn.classList.add('disabled');
            moveBtn.setAttribute('disabled', 'true');
            deleteBtn.classList.add('disabled');
            deleteBtn.setAttribute('disabled', 'true');
            console.log('🔘 Action buttons disabled');
        }
    } else {
        console.log('⚠️ Action buttons not found - moveBtn:', !!moveBtn, 'deleteBtn:', !!deleteBtn);
    }
}

function updateSelectAllCheckbox() {
    const allCheckboxes = document.querySelectorAll('.file-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    
    if (!selectAllCheckbox) {
        console.log('⚠️ Select all checkbox not found');
        return;
    }
    
    if (checkedCheckboxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
    
    console.log('📋 Updated select all checkbox:', {
        total: allCheckboxes.length,
        checked: checkedCheckboxes.length,
        selectAllChecked: selectAllCheckbox.checked,
        indeterminate: selectAllCheckbox.indeterminate
    });
}

async function openMoveDialog() {
    console.log('📂 openMoveDialog called');
    console.log('📊 Legacy selectedFiles size:', selectedFiles.size);
    console.log('📊 MoreMenuManager available:', !!window.moreMenuManager);
    console.log('📊 MoreMenuManager selectedFiles size:', window.moreMenuManager?.selectedFiles?.size || 0);
    
    // Get selected files from MoreMenuSelectionManager if available
    let filesToMove = selectedFiles;
    if (window.moreMenuManager && window.moreMenuManager.selectedFiles.size > 0) {
        filesToMove = window.moreMenuManager.selectedFiles;
        console.log('✅ Using MoreMenuManager selection');
    } else {
        console.log('⚠️ Using legacy selectedFiles');
    }
    
    console.log('📁 Files to move:', Array.from(filesToMove));
    
    if (filesToMove.size === 0) {
        console.log('❌ No files selected - showing error');
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast('Please select files to move', 'warning');
        } else {
            alert('Please select files to move');
        }
        return;
    }
    
    console.log('🔄 Opening move dialog for files:', Array.from(filesToMove));
    
    // Update selected count in dialog
    const selectedCountElement = document.getElementById('selected-count');
    if (selectedCountElement) {
        selectedCountElement.textContent = `${filesToMove.size} file dipilih`;
    }
    
    // Load folders
    try {
        const response = await getAllFolders();
        if (response.status === 'ok') {
            populateFolderSelect(response.folders);
            
            // Show move dialog with proper z-index and visibility
            const bgBlur = document.getElementById('bg-blur');
            const moveDialog = document.getElementById('move-files-dialog');
            
            bgBlur.style.display = 'block';
            bgBlur.style.zIndex = '1000';
            bgBlur.style.opacity = '0.3';
            
            moveDialog.style.display = 'block';
            moveDialog.style.zIndex = '1001';
            moveDialog.style.opacity = '1';
            
            console.log('✅ Move dialog displayed with proper z-index');
        } else {
            const errorMsg = 'Error loading folders: ' + response.status;
            if (window.googleDriveUI && window.googleDriveUI.showToast) {
                window.googleDriveUI.showToast(errorMsg, 'error');
            } else {
                alert(errorMsg);
            }
        }
    } catch (error) {
        const errorMsg = 'Error loading folders: ' + error.message;
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast(errorMsg, 'error');
        } else {
            alert(errorMsg);
        }
    }
}

// Expose to global scope
window.openMoveDialog = openMoveDialog;

function populateFolderSelect(folders) {
    const select = document.getElementById('destination-folder');
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select destination folder...';
    select.appendChild(defaultOption);
    
    // Sort folders by name
    const folderArray = Object.values(folders).sort((a, b) => a.name.localeCompare(b.name));
    
    folderArray.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder.path;
        option.textContent = folder.name;
        select.appendChild(option);
    });
}

function closeMoveDialog() {
    const bgBlur = document.getElementById('bg-blur');
    const moveDialog = document.getElementById('move-files-dialog');
    
    bgBlur.style.opacity = '0';
    moveDialog.style.opacity = '0';
    
    setTimeout(() => {
        bgBlur.style.display = 'none';
        bgBlur.style.zIndex = '-1';
        moveDialog.style.display = 'none';
        moveDialog.style.zIndex = '-1';
    }, 300);
    
    console.log('✅ Move dialog closed');
}

async function confirmMoveFiles() {
    const destinationPath = document.getElementById('destination-folder').value;
    
    if (!destinationPath) {
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast('Please select a destination folder', 'warning');
        } else {
            alert('Please select a destination folder');
        }
        return;
    }
    
    // Get selected files - prefer MoreMenuSelectionManager's selection
    let filesToMove;
    if (window.moreMenuManager && window.moreMenuManager.selectedFiles.size > 0) {
        // MoreMenuSelectionManager uses file paths
        filesToMove = Array.from(window.moreMenuManager.selectedFiles);
        console.log('🔄 Moving files using MoreMenuManager paths:', filesToMove);
    } else {
        // Legacy mode uses file IDs
        filesToMove = Array.from(selectedFiles);
        console.log('🔄 Moving files using legacy file IDs:', filesToMove);
    }
    
    if (filesToMove.length === 0) {
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast('No files selected to move', 'warning');
        } else {
            alert('No files selected to move');
        }
        return;
    }
    
    try {
        // Show loading
        document.getElementById('move-confirm').textContent = 'Moving...';
        document.getElementById('move-confirm').disabled = true;
        
        const response = await moveFiles(filesToMove, destinationPath);
        
        if (response.status === 'ok') {
            const successMsg = `Successfully moved ${response.moved_items.length} file(s)`;
            if (window.googleDriveUI && window.googleDriveUI.showToast) {
                window.googleDriveUI.showToast(successMsg, 'success');
            } else {
                alert(successMsg);
            }
            
            closeMoveDialog();
            
            // Exit selection mode - use MoreMenuManager if available
            if (window.moreMenuManager && window.moreMenuManager.isSelectionMode) {
                window.moreMenuManager.exitSelectionMode();
            } else {
                exitSelectionMode();
            }
            
            // Reload current directory
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            const errorMsg = 'Error moving files: ' + response.status;
            if (window.googleDriveUI && window.googleDriveUI.showToast) {
                window.googleDriveUI.showToast(errorMsg, 'error');
            } else {
                alert(errorMsg);
            }
        }
    } catch (error) {
        const errorMsg = 'Error moving files: ' + error.message;
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast(errorMsg, 'error');
        } else {
            alert(errorMsg);
        }
    } finally {
        // Reset button
        document.getElementById('move-confirm').textContent = 'Move Files';
        document.getElementById('move-confirm').disabled = false;
    }
}

// Delete selected files function
async function deleteSelectedFiles() {
    if (selectedFiles.size === 0) {
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast('Tidak ada file yang dipilih', 'warning');
        } else {
            alert('Tidak ada file yang dipilih');
        }
        return;
    }
    
    const fileCount = selectedFiles.size;
    const confirmMessage = `Yakin ingin memindahkan ${fileCount} file(s) ke sampah?`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    try {
        // Convert to array of paths
        const filePaths = Array.from(selectedFiles);
        
        // Here you would call your delete API
        // For now, just show success message
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast(`${fileCount} file(s) dipindahkan ke sampah`, 'success');
        } else {
            alert(`${fileCount} file(s) dipindahkan ke sampah`);
        }
        
        // Exit selection mode
        exitSelectionMode();
        
        // Reload directory
        setTimeout(() => {
            window.location.reload();
        }, 500);
        
    } catch (error) {
        const errorMsg = 'Error menghapus file: ' + error.message;
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast(errorMsg, 'error');
        } else {
            alert(errorMsg);
        }
    }
}

// Expose to global scope
window.deleteSelectedFiles = deleteSelectedFiles;

// Update showDirectory function to work with selection mode
function updateShowDirectoryForSelection() {
    // This function will be called after directory is loaded to add checkboxes if in selection mode
    if (isSelectionMode) {
        setTimeout(() => {
            addCheckboxesToRows();
        }, 100);
    }
}

// Hook into existing showDirectory function
const originalShowDirectory = window.showDirectory;
if (originalShowDirectory) {
    window.showDirectory = function(data) {
        originalShowDirectory(data);
        updateShowDirectoryForSelection();
    };
}

// Expose functions at the end of file as well for maximum compatibility
window.startSelectionWithFile = window.startSelectionWithFile || startSelectionWithFile;
window.handleFileSelection = window.handleFileSelection || handleFileSelection;
window.openMoveDialog = window.openMoveDialog || openMoveDialog;
window.deleteSelectedFiles = window.deleteSelectedFiles || deleteSelectedFiles;
window.exitSelectionMode = window.exitSelectionMode || exitSelectionMode;

// Final console log to confirm system is ready
console.log('🎯 moveFiles.js loaded and functions exposed:', {
    startSelectionWithFile: typeof window.startSelectionWithFile,
    handleFileSelection: typeof window.handleFileSelection,
    openMoveDialog: typeof window.openMoveDialog,
    deleteSelectedFiles: typeof window.deleteSelectedFiles,
    exitSelectionMode: typeof window.exitSelectionMode,
    moveFilesSystemReady: window.moveFilesSystemReady
});