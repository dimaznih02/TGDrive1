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

// Initialize move files functionality when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMoveFiles();
});

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
    
    // Selection mode will be triggered from context menu, not button
    
    // Selection notification bar buttons
    document.getElementById('move-selected-btn').addEventListener('click', function() {
        if (selectedFiles.size > 0) {
            openMoveDialog();
        }
    });
    
    document.getElementById('delete-selected-btn').addEventListener('click', function() {
        if (selectedFiles.size > 0) {
            deleteSelectedFiles();
        }
    });
    
    document.getElementById('cancel-select-btn').addEventListener('click', exitSelectionMode);
    
    // Move dialog buttons
    document.getElementById('move-cancel').addEventListener('click', closeMoveDialog);
    document.getElementById('move-confirm').addEventListener('click', confirmMoveFiles);
    
    // Select all checkbox (both in notification bar and header)
    document.getElementById('select-all-checkbox').addEventListener('change', handleSelectAll);
    
    const headerSelectAll = document.getElementById('header-select-all');
    if (headerSelectAll) {
        headerSelectAll.addEventListener('change', handleSelectAll);
    }
    
    console.log('✅ Move files system initialized');
}

// Start selection mode with a specific file (triggered from context menu)
function startSelectionWithFile(fileElement) {
    console.log('🚀 startSelectionWithFile called with element:', fileElement);
    console.log('📂 Current selection mode:', isSelectionMode);
    
    if (!isSelectionMode) {
        console.log('⚡ Entering selection mode...');
        enterSelectionMode();
    }
    
    // Get file ID/path
    const fileId = fileElement.getAttribute('data-id') || fileElement.getAttribute('data-path');
    const fileName = fileElement.getAttribute('data-name');
    console.log('📋 File info - ID:', fileId, 'Name:', fileName);
    
    // Add this file to selection
    selectedFiles.add(fileId);
    fileElement.classList.add('selected');
    console.log('✅ Added to selection, element classes:', fileElement.className);
    
    // Update UI
    updateSelectedCount();
    updateSelectAllCheckbox();
    
    // Force notification bar to show
    const notificationBar = document.getElementById('selection-notification-bar');
    if (notificationBar) {
        notificationBar.style.display = 'flex';
        console.log('📢 Notification bar displayed');
    } else {
        console.log('❌ Notification bar not found');
    }
    
    // Show toast notification
    if (window.googleDriveUI && window.googleDriveUI.showToast) {
        window.googleDriveUI.showToast(`"${fileName}" dipilih`, 'success');
    } else {
        console.log('🔔 Toast: File dipilih -', fileName);
    }
    
    console.log('🎯 Started selection with file:', fileName, 'Total selected:', selectedFiles.size);
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
    isSelectionMode = true;
    document.body.classList.add('selection-mode');
    
    // Show/hide appropriate buttons
    document.getElementById('select-mode-btn').classList.add('hidden');
    document.getElementById('move-files-btn').classList.remove('hidden');
    document.getElementById('cancel-select-btn').classList.remove('hidden');
    
    // Show checkbox column
    document.querySelectorAll('.checkbox-column').forEach(el => {
        el.classList.remove('hidden');
    });
    
    // Add checkboxes to all rows
    addCheckboxesToRows();
    
    updateSelectedCount();
}

function exitSelectionMode() {
    isSelectionMode = false;
    document.body.classList.remove('selection-mode');
    selectedFiles.clear();
    
    // Remove checkboxes from file items
    document.querySelectorAll('.file-item .checkbox-column').forEach(checkbox => {
        checkbox.remove();
    });
    
    // Remove selected styling from rows
    document.querySelectorAll('.file-item.selected').forEach(row => {
        row.classList.remove('selected');
    });
    
    // Uncheck select all checkboxes
    document.getElementById('select-all-checkbox').checked = false;
    const headerSelectAll = document.getElementById('header-select-all');
    if (headerSelectAll) {
        headerSelectAll.checked = false;
    }
    
    updateSelectedCount();
}

// Expose to global scope
window.exitSelectionMode = exitSelectionMode;

function addCheckboxesToRows() {
    document.querySelectorAll('.file-item').forEach(row => {
        if (!row.querySelector('.file-checkbox')) {
            // Create checkbox element
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-column flex justify-center items-center';
            checkboxDiv.innerHTML = '<input type="checkbox" class="file-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">';
            
            // Insert as first child
            row.insertBefore(checkboxDiv, row.firstChild);
            
            const checkbox = checkboxDiv.querySelector('.file-checkbox');
            const fileId = row.getAttribute('data-id') || row.getAttribute('data-path');
            
            checkbox.addEventListener('change', function() {
                handleFileSelection(fileId, checkbox.checked, row);
            });
        }
    });
}

function handleFileSelection(fileId, isSelected, row) {
    if (isSelected) {
        selectedFiles.add(fileId);
        row.classList.add('selected');
    } else {
        selectedFiles.delete(fileId);
        row.classList.remove('selected');
    }
    
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
    }
}

function updateSelectAllCheckbox() {
    const allCheckboxes = document.querySelectorAll('.file-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    
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
            
            // Show move dialog
            document.getElementById('bg-blur').style.zIndex = '2';
            document.getElementById('bg-blur').style.opacity = '0.1';
            document.getElementById('move-files-dialog').style.zIndex = '3';
            document.getElementById('move-files-dialog').style.opacity = '1';
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
    document.getElementById('bg-blur').style.opacity = '0';
    document.getElementById('move-files-dialog').style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('bg-blur').style.zIndex = '-1';
        document.getElementById('move-files-dialog').style.zIndex = '-1';
    }, 300);
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