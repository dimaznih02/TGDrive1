// Move Files JavaScript Functionality

let selectedFiles = new Set();
let isSelectionMode = false;

// Initialize move files functionality when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMoveFiles();
});

function initializeMoveFiles() {
    // Add event listeners for buttons
    document.getElementById('select-mode-btn').addEventListener('click', toggleSelectionMode);
    document.getElementById('move-files-btn').addEventListener('click', openMoveDialog);
    document.getElementById('cancel-select-btn').addEventListener('click', exitSelectionMode);
    
    // Move dialog buttons
    document.getElementById('move-cancel').addEventListener('click', closeMoveDialog);
    document.getElementById('move-confirm').addEventListener('click', confirmMoveFiles);
    
    // Select all checkbox
    document.getElementById('select-all-checkbox').addEventListener('change', handleSelectAll);
}

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
    
    // Show/hide appropriate buttons
    document.getElementById('select-mode-btn').classList.remove('hidden');
    document.getElementById('move-files-btn').classList.add('hidden');
    document.getElementById('cancel-select-btn').classList.add('hidden');
    
    // Hide checkbox column
    document.querySelectorAll('.checkbox-column').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Remove selected styling from rows
    document.querySelectorAll('.body-tr.selected').forEach(row => {
        row.classList.remove('selected');
    });
    
    // Uncheck select all checkbox
    document.getElementById('select-all-checkbox').checked = false;
    
    updateSelectedCount();
}

function addCheckboxesToRows() {
    document.querySelectorAll('.body-tr').forEach(row => {
        const firstCell = row.querySelector('td');
        if (firstCell && !firstCell.querySelector('.file-checkbox')) {
            const checkboxCell = document.createElement('td');
            checkboxCell.innerHTML = '<input type="checkbox" class="file-checkbox">';
            row.insertBefore(checkboxCell, firstCell);
            
            const checkbox = checkboxCell.querySelector('.file-checkbox');
            const fileId = row.getAttribute('data-id');
            
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

function handleSelectAll(event) {
    const isChecked = event.target.checked;
    
    document.querySelectorAll('.file-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
        const row = checkbox.closest('.body-tr');
        const fileId = row.getAttribute('data-id');
        
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
    document.getElementById('selected-count-header').textContent = count;
    document.getElementById('selected-count').textContent = `${count} files selected`;
    
    // Enable/disable move button
    const moveBtn = document.getElementById('move-files-btn');
    if (count > 0) {
        moveBtn.classList.remove('disabled');
        moveBtn.disabled = false;
    } else {
        moveBtn.classList.add('disabled');
        moveBtn.disabled = true;
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
    // Get selected files from MoreMenuSelectionManager if available
    let filesToMove = selectedFiles;
    if (window.moreMenuManager && window.moreMenuManager.selectedFiles.size > 0) {
        filesToMove = window.moreMenuManager.selectedFiles;
    }
    
    if (filesToMove.size === 0) {
        if (window.googleDriveUI && window.googleDriveUI.showToast) {
            window.googleDriveUI.showToast('Please select files to move', 'warning');
        } else {
            alert('Please select files to move');
        }
        return;
    }
    
    console.log('🔄 Opening move dialog for files:', Array.from(filesToMove));
    
    // Update selected count in dialog
    document.getElementById('selected-count').textContent = `${filesToMove.size} files selected`;
    
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