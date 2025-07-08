function showDirectory(data) {
    data = data['contents']
    const currentPath = getCurrentPath()
    const isTrash = currentPath.startsWith('/trash')
    const isHome = currentPath === '/home'
    
    // Only show home page layout for '/home' path (Beranda)
    if (isHome && !isTrash) {
        showHomePage(data)
        return
    }
    
    // Original directory listing
    document.getElementById('directory-data').innerHTML = ''
    let html = ''

    // Step 2: Sort the array based on the 'date' values
    let entries = Object.entries(data);
    let folders = entries.filter(([key, value]) => value.type === 'folder');
    let files = entries.filter(([key, value]) => value.type === 'file');

    folders.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));
    files.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));

    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        if (diffInHours < 1) {
            return 'baru saja';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} jam`;
        } else if (diffInDays < 7) {
            return `${diffInDays} hari`;
        } else {
            // Format: "8 Jun 2024" or just "8 Jun" for current year
            const currentYear = now.getFullYear();
            const fileYear = date.getFullYear();
            
            if (fileYear === currentYear) {
                return date.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short'
                });
            } else {
                return date.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                });
            }
        }
    }

    for (const [key, item] of folders) {
        if (item.type === 'folder') {
            const formattedDate = formatDate(item.upload_date);
            
            html += `
                <div class="grid px-4 py-2 items-center hover:bg-gray-50 border-b border-gray-200 cursor-pointer folder-tr file-item" data-path="${item.path}" data-id="${item.id}" data-name="${item.name}" data-type="folder" style="grid-template-columns: 1fr 200px 150px 120px 40px;">
                    <div class="flex items-center gap-2 truncate">
                        <span class="text-lg">📁</span>
                        <span class="text-sm text-gray-900 truncate file-name">${item.name}</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-sm">🧑</span>
                        <span class="text-sm text-gray-700 owner-name">saya</span>
                    </div>
                    <div class="flex justify-center text-sm text-gray-700 modified-date">${formattedDate}</div>
                    <div class="flex justify-center text-sm text-gray-700 file-size">—</div>
                    <div class="flex justify-center">
                        <button class="more-btn p-1 rounded hover:bg-gray-200 transition-colors" onclick="event.stopPropagation(); showContextMenu(event, '${item.name}', 'folder', '${item.path}')">
                            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            // Old more-options system removed to avoid conflict with new context menu
        }
    }

    for (const [key, item] of files) {
        if (item.type === 'file') {
            const size = convertBytes(item.size);
            const formattedDate = formatDate(item.upload_date);
            
            // Determine file icon based on extension
            const extension = item.name.split('.').pop().toLowerCase();
            let fileIconClass = 'document';
            let fileIconPath = 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z';
            
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
                fileIconClass = 'image';
                fileIconPath = 'M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19C20.1,21 21,20.1 21,19Z';
            } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(extension)) {
                fileIconClass = 'video';
                fileIconPath = 'M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z';
            }

            // Determine file icon emoji based on extension
            let fileIcon = '📄'; // default document
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
                fileIcon = '🖼️';
            } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(extension)) {
                fileIcon = '🎞️';
            } else if (['pdf'].includes(extension)) {
                fileIcon = '📕';
            } else if (['doc', 'docx'].includes(extension)) {
                fileIcon = '📘';
            } else if (['xls', 'xlsx'].includes(extension)) {
                fileIcon = '📊';
            } else if (['zip', 'rar', '7z'].includes(extension)) {
                fileIcon = '🗜️';
            }

            html += `
                <div class="grid px-4 py-2 items-center hover:bg-gray-50 border-b border-gray-200 cursor-pointer file-tr file-item" data-path="${item.path}" data-id="${item.id}" data-name="${item.name}" data-type="file" style="grid-template-columns: 1fr 200px 150px 120px 40px;">
                    <div class="flex items-center gap-2 truncate">
                        <span class="text-lg">${fileIcon}</span>
                        <span class="text-sm text-gray-900 truncate file-name">${item.name}</span>
                    </div>
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-sm">🧑</span>
                        <span class="text-sm text-gray-700 owner-name">saya</span>
                    </div>
                    <div class="flex justify-center text-sm text-gray-700 modified-date">${formattedDate}</div>
                    <div class="flex justify-center text-sm text-gray-700 file-size">${size}</div>
                    <div class="flex justify-center">
                        <button class="more-btn p-1 rounded hover:bg-gray-200 transition-colors" onclick="event.stopPropagation(); showContextMenu(event, '${item.name}', 'file', '${item.path}')">
                            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            // Old more-options system removed to avoid conflict with new context menu
        }
    }
    document.getElementById('directory-data').innerHTML = html

    if (!isTrash) {
        document.querySelectorAll('.folder-tr').forEach(div => {
            div.ondblclick = openFolder;
        });
        document.querySelectorAll('.file-tr').forEach(div => {
            div.ondblclick = openFile;
        });
    }

    // More buttons now use new context menu system - no need for old openMoreButton
    
    // Add right-click context menu to all file items
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            const fileName = item.dataset.name;
            const fileType = item.dataset.type;
            const filePath = item.dataset.path;
            showContextMenu(event, fileName, fileType, filePath);
        });
    });
    
    // Trigger update for move files functionality if it exists
    if (typeof updateShowDirectoryForSelection === 'function') {
        updateShowDirectoryForSelection();
    }
    
    // Re-attach context menu and enhancements to new files
    setTimeout(() => {
        if (window.googleDriveUI) {
            window.googleDriveUI.enhanceFileItems();
            window.googleDriveUI.reAttachEventListeners();
        }
        if (window.driveEnhancements) {
            window.driveEnhancements.enhanceNewFiles();
        }
        if (typeof enhanceMoreMenu === 'function') {
            enhanceMoreMenu();
        }
        // Important: Call moreMenuManager.onDirectoryRefresh last to ensure all DOM elements are ready
        if (window.moreMenuManager) {
            window.moreMenuManager.onDirectoryRefresh();
        }
        
        // Initialize Google Drive UI context menu if not already initialized
        if (!window.googleDriveUI) {
            window.googleDriveUI = new GoogleDriveUI();
            console.log('✅ GoogleDriveUI initialized');
        }
    }, 120);
}

// Context Menu Handler
function showContextMenu(event, fileName, fileType, filePath) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🖱️ Context menu triggered:', { fileName, fileType, filePath });
    
    // ALWAYS use basic context menu for testing - skip GoogleDriveUI
    console.log('🎯 Using basic context menu for debugging');
    showBasicContextMenu(event, fileName, fileType, filePath);
}

// Fallback basic context menu with smart positioning
function showBasicContextMenu(event, fileName, fileType, filePath) {
    console.log('📋 showBasicContextMenu called for:', fileName);
    
    // Remove existing context menu
    const existingMenu = document.getElementById('basic-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Check if we're in selection mode to show different options
    const inSelectionMode = document.body.classList.contains('selection-mode');
    const hasSelectedFiles = window.selectedFiles && window.selectedFiles.size > 0;
    
    console.log('🔍 Selection state:', { inSelectionMode, hasSelectedFiles, selectedCount: window.selectedFiles?.size });
    
    let menuItems = [];
    
    if (inSelectionMode && hasSelectedFiles) {
        // Selection mode menu items
        menuItems = [
            { icon: '📂', text: fileType === 'folder' ? 'Buka folder' : 'Buka', action: 'open' },
            { icon: '☑️', text: 'Tambah ke pilihan', action: 'add-selection' },
                         { icon: '📁', text: `Pindahkan ${window.selectedFiles.size} file terpilih`, action: 'move-selected' },
             { icon: '🗑️', text: `Hapus ${window.selectedFiles.size} file terpilih`, action: 'delete-selected' },
            { icon: '❌', text: 'Batalkan pilihan', action: 'cancel-selection' }
        ];
    } else {
        // Normal menu items
        menuItems = [
            { icon: '📂', text: fileType === 'folder' ? 'Buka folder' : 'Buka', action: 'open' },
            { icon: '⬇️', text: 'Download', action: 'download', hide: fileType === 'folder' },
            { icon: '☑️', text: 'Pilih', action: 'select' },
            { icon: '✏️', text: 'Ganti nama', action: 'rename' },
            { icon: '👥', text: 'Bagikan', action: 'share' },
            { icon: '📁', text: 'Pindahkan', action: 'move' },
            { icon: '🗑️', text: 'Pindahkan ke sampah', action: 'delete' },
            { icon: 'ℹ️', text: 'Informasi', action: 'info' }
        ];
    }
    
    const menuHTML = menuItems
        .filter(item => !item.hide)
        .map(item => `
            <div class="context-menu-item" onclick="handleBasicContextAction('${item.action}', '${fileName}', '${fileType}', '${filePath}')">
                <div class="context-menu-item-icon">${item.icon}</div>
                <span class="context-menu-item-text">${item.text}</span>
            </div>
        `).join('');
    
    // Create basic context menu
    const contextMenu = document.createElement('div');
    contextMenu.id = 'basic-context-menu';
    contextMenu.className = 'context-menu show';
    contextMenu.innerHTML = menuHTML;
    
    // Add to DOM first to measure dimensions
    contextMenu.style.position = 'fixed';
    contextMenu.style.visibility = 'hidden';
    contextMenu.style.opacity = '0';
    document.body.appendChild(contextMenu);
    
    // Get menu dimensions and viewport bounds
    const menuRect = contextMenu.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate initial position
    let left = event.clientX;
    let top = event.clientY;
    
    // Smart positioning - adjust if menu would go outside viewport
    
    // Check right edge
    if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 10; // 10px margin
    }
    
    // Check left edge
    if (left < 10) {
        left = 10;
    }
    
    // Check bottom edge - this is the main issue!
    if (top + menuHeight > viewportHeight) {
        // Position above the cursor instead of below
        top = event.clientY - menuHeight - 5; // 5px margin above cursor
    }
    
    // Check top edge (in case menu is too tall)
    if (top < 10) {
        top = 10;
    }
    
    // Apply final position and make visible
    contextMenu.style.left = left + 'px';
    contextMenu.style.top = top + 'px';
    contextMenu.style.visibility = 'visible';
    contextMenu.style.opacity = '1';
    
    console.log(`📍 Context menu positioned at: ${left}, ${top} (viewport: ${viewportWidth}x${viewportHeight}, menu: ${menuWidth}x${menuHeight})`);
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 100);
}

// Handle basic context menu actions
function handleBasicContextAction(action, fileName, fileType, filePath) {
    console.log('🎯 handleBasicContextAction called:', { action, fileName, fileType, filePath });
    
    // Remove context menu
    const menu = document.getElementById('basic-context-menu');
    if (menu) menu.remove();
    
    console.log('🎯 Context action:', { action, fileName, fileType, filePath });
    
    switch (action) {
        case 'open':
            if (fileType === 'folder') {
                openFolder({ target: { closest: () => ({ dataset: { path: filePath } }) } });
            } else {
                openFile({ target: { closest: () => ({ dataset: { path: filePath } }) } });
            }
            break;
            
        case 'select':
            console.log('🎯 Select action triggered for:', fileName, 'at path:', filePath);
            
            // Find file element
            const fileElement = document.querySelector(`[data-path="${filePath}"]`);
            console.log('📁 Found file element:', fileElement);
            
            if (fileElement) {
                // Initialize global selection
                if (!window.selectedFiles) {
                    window.selectedFiles = new Set();
                }
                
                // Add this file to selection
                const fileId = fileElement.getAttribute('data-id') || filePath;
                window.selectedFiles.add(fileId);
                
                // Add visual highlight
                fileElement.classList.add('selected');
                
                // Activate selection mode
                document.body.classList.add('selection-mode');
                
                // Show notification bar
                const selectionBar = document.getElementById('selection-notification-bar');
                if (selectionBar) {
                    selectionBar.style.display = 'flex';
                }
                
                // Add checkboxes to all files
                addCheckboxesToAllFiles();
                
                // Update counter
                updateSelectionCounter();
                
                console.log('✅ File selected successfully:', fileName);
            } else {
                console.log('❌ File element not found:', filePath);
            }
            break;
            
        case 'add-selection':
            // Add this file to existing selection
            const targetElement = document.querySelector(`[data-path="${filePath}"]`);
            if (targetElement) {
                const fileId = targetElement.getAttribute('data-id') || filePath;
                const isSelected = targetElement.classList.contains('selected');
                
                // Find checkbox and toggle it
                const checkbox = targetElement.querySelector('.file-checkbox');
                if (checkbox) {
                    checkbox.checked = !isSelected;
                    handleFileSelectionChange(fileId, !isSelected, targetElement);
                }
                
                console.log(`${isSelected ? 'Removed from' : 'Added to'} selection:`, fileName);
            }
            break;
            
        case 'move-selected':
            const selectedCount = window.selectedFiles ? window.selectedFiles.size : 0;
            if (selectedCount > 0) {
                console.log(`📁 Moving ${selectedCount} file(s):`, Array.from(window.selectedFiles));
                // Here you would call your move API - for now just show a single alert
                alert(`📁 Will move ${selectedCount} selected file(s)`);
            } else {
                console.log('❌ No files selected for move');
            }
            break;
            
        case 'delete-selected':
            const deleteCount = window.selectedFiles ? window.selectedFiles.size : 0;
            if (deleteCount > 0) {
                if (confirm(`🗑️ Delete ${deleteCount} selected file(s)?`)) {
                    console.log(`🗑️ Deleting ${deleteCount} file(s):`, Array.from(window.selectedFiles));
                    // Clear selection after delete
                    window.selectedFiles.clear();
                    updateSelectionCounter();
                }
            } else {
                console.log('❌ No files selected for delete');
            }
            break;
            
        case 'cancel-selection':
            // Clear all selections manually
            if (window.selectedFiles) {
                window.selectedFiles.clear();
            }
            
            // Remove selected class from all files
            document.querySelectorAll('.file-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Remove all checkboxes
            document.querySelectorAll('.file-item .checkbox-column').forEach(cb => cb.remove());
            
            // Exit selection mode
            document.body.classList.remove('selection-mode');
            
            // Hide notification bar
            const notificationBar = document.getElementById('selection-notification-bar');
            if (notificationBar) {
                notificationBar.style.display = 'none';
            }
            
            console.log('❌ Selection cancelled');
            break;
            
        case 'download':
            if (fileType === 'file') {
                window.open(`/file?path=${encodeURIComponent(filePath)}`, '_blank');
            }
            break;
            
        case 'rename':
            const newName = prompt(`Ganti nama "${fileName}" menjadi:`, fileName);
            if (newName && newName !== fileName) {
                // Call rename API if available
                if (typeof renameFileFolder === 'function') {
                    renameFileFolder(filePath, newName);
                } else {
                    alert(`Fitur rename akan mengganti "${fileName}" menjadi "${newName}"`);
                }
            }
            break;
            
        case 'share':
            alert(`👥 Bagikan: ${fileName}`);
            break;
            
        case 'move':
            // Show move modal or use existing move functionality
            if (window.moreMenuManager) {
                // Use existing move files functionality
                showMoveDialog([filePath]);
            } else {
                alert(`📁 Fitur pindahkan untuk: ${fileName}`);
            }
            break;
            
        case 'delete':
            if (confirm(`🗑️ Yakin ingin memindahkan "${fileName}" ke sampah?`)) {
                // Call delete API if available
                if (typeof deleteFileFolder === 'function') {
                    deleteFileFolder(filePath);
                } else {
                    alert(`File "${fileName}" akan dipindahkan ke sampah`);
                }
            }
            break;
            
        case 'info':
            const info = `ℹ️ Informasi ${fileType}:
            
Nama: ${fileName}
Tipe: ${fileType}
Path: ${filePath}
Pemilik: saya`;
            alert(info);
            break;
    }
}

// Helper functions for manual selection (independent of moveFiles.js)
function addCheckboxesToAllFiles() {
    console.log('📋 Adding checkboxes to all files...');
    
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
            
            // Add event listener for checkbox changes
            checkbox.addEventListener('change', function() {
                handleFileSelectionChange(fileId, checkbox.checked, row);
            });
            
            console.log('✅ Added checkbox to:', row.getAttribute('data-name'));
        }
    });
}

function handleFileSelectionChange(fileId, isSelected, row) {
    console.log('🔄 File selection changed:', fileId, 'selected:', isSelected);
    
    if (!window.selectedFiles) {
        window.selectedFiles = new Set();
    }
    
    if (isSelected) {
        window.selectedFiles.add(fileId);
        row.classList.add('selected');
    } else {
        window.selectedFiles.delete(fileId);
        row.classList.remove('selected');
    }
    
    updateSelectionCounter();
}

function updateSelectionCounter() {
    const count = window.selectedFiles ? window.selectedFiles.size : 0;
    console.log('📊 Updating selection counter to:', count);
    
    // Update notification bar text
    const countTextElement = document.getElementById('selected-count-text');
    if (countTextElement) {
        const text = count === 1 ? '1 item dipilih' : `${count} item dipilih`;
        countTextElement.innerHTML = `<span id="selected-count-header">${count}</span> item dipilih`;
    }
    
    // Show/hide notification bar
    const notificationBar = document.getElementById('selection-notification-bar');
    if (notificationBar) {
        if (count > 0) {
            notificationBar.style.display = 'flex';
        } else {
            notificationBar.style.display = 'none';
            // Exit selection mode if no files selected
            document.body.classList.remove('selection-mode');
            // Remove all checkboxes
            document.querySelectorAll('.file-item .checkbox-column').forEach(cb => cb.remove());
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
        } else {
            moveBtn.classList.add('disabled');
            moveBtn.setAttribute('disabled', 'true');
            deleteBtn.classList.add('disabled');
            deleteBtn.setAttribute('disabled', 'true');
        }
    }
}

// Show move dialog function for compatibility
function showMoveDialog(filePaths) {
    console.log('📁 Showing move dialog for:', filePaths);
    
    // Use existing move files dialog if available
    const moveDialog = document.getElementById('move-files-dialog');
    if (moveDialog) {
        // Set selected files
        if (window.moreMenuManager) {
            window.moreMenuManager.selectedFiles.clear();
            filePaths.forEach(path => window.moreMenuManager.selectedFiles.add(path));
            window.moreMenuManager.updateSelectionCount();
        }
        
        // Show the dialog
        document.getElementById('bg-blur').style.display = 'block';
        moveDialog.style.display = 'block';
        
        // Load folders for destination selection
        if (typeof loadFoldersForMove === 'function') {
            loadFoldersForMove();
        }
    } else {
        // Fallback alert
        const fileNames = filePaths.map(path => path.split('/').pop()).join(', ');
        alert(`📁 Fitur pindahkan file:\n\nFile(s): ${fileNames}\n\nModal pemilihan folder akan segera tersedia.`);
    }
}

function showHomePage(data) {
    // Sort all items by upload date
    let entries = Object.entries(data);
    let folders = entries.filter(([key, value]) => value.type === 'folder');
    let files = entries.filter(([key, value]) => value.type === 'file');

    folders.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));
    files.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));

    // Get suggested folders (latest 2 folders)
    const suggestedFolders = folders.slice(0, 2);
    
    // Get suggested files (latest 10 files)
    const suggestedFiles = files.slice(0, 10);

    // Create home page HTML with proper structure
    const homePageHTML = `
        <div class="home-page-container">
            <div class="home-welcome">
                <h1>Selamat datang di Drive</h1>
                <button class="info-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                    </svg>
                </button>
            </div>

            ${suggestedFolders.length > 0 ? `
            <!-- Suggested Folders Section -->
            <div class="suggested-section">
                <div class="section-header">
                    <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                    </svg>
                    <h2>Folder yang disarankan</h2>
                </div>
                <div class="suggested-folders-grid">
                    ${suggestedFolders.map(([key, folder]) => `
                        <div class="folder-card" data-path="${folder.path}">
                            <div class="folder-card-content">
                                <div class="folder-icon-wrapper">
                                    <svg class="folder-icon-large" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                                    </svg>
                                </div>
                                                                 <div class="folder-info">
                                     <div class="folder-name">${folder.name}</div>
                                 </div>
                            </div>
                            <button class="folder-menu-btn" data-id="${folder.id}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                                </svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            ${suggestedFiles.length > 0 ? `
            <!-- Suggested Files Section -->
            <div class="suggested-section">
                <div class="section-header-with-controls">
                    <div class="section-title">
                        <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                        </svg>
                        <h2>File yang disarankan</h2>
                    </div>
                    <div class="view-controls">
                        <button class="view-btn active" data-view="list">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,5H21V7H3V5M3,13V11H21V13H3M3,19V17H21V19H3Z"/>
                            </svg>
                        </button>
                        <button class="view-btn" data-view="grid">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,11H11V3H3M5,5H9V9H5M13,21H21V13H13M15,15H19V19H15M3,21H11V13H3M5,15H9V19H5M13,3V11H21V3M15,5H19V9H15"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                                 <div class="suggested-files-table">
                     <div class="table-header">
                         <div class="col-name">Nama</div>
                         <div class="col-reason">Alasan file disarankan</div>
                         <div class="col-location">Lokasi</div>
                     </div>
                    
                    <div class="file-list">
                        ${suggestedFiles.map(([key, file]) => {
                            const uploadDate = new Date(file.upload_date);
                            const now = new Date();
                            const timeDiff = now - uploadDate;
                            const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                            
                            let reasonText = "";
                            if (hoursDiff < 1) {
                                reasonText = "Anda mengubahnya";
                            } else if (hoursDiff < 24) {
                                reasonText = "Anda mengubahnya";
                            } else if (daysDiff === 1) {
                                reasonText = "Anda membuatnya";
                            } else {
                                reasonText = "Anda menguploadnya";
                            }
                            
                            let timeText = "";
                            if (hoursDiff < 1) {
                                timeText = "• baru saja";
                            } else if (hoursDiff < 24) {
                                timeText = `• ${hoursDiff} jam`;
                            } else {
                                timeText = `• ${daysDiff} hari`;
                            }
                            
                            return `
                                 <div class="file-item" data-path="${file.path}" data-id="${file.id}">
                                     <div class="file-info">
                                         <svg class="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                             <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                         </svg>
                                         <span class="file-name">${file.name}</span>
                                     </div>
                                     <div class="file-reason">${reasonText} ${timeText}</div>
                                     <div class="file-location">
                                         <svg class="folder-icon-small" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                             <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                                         </svg>
                                         Drive Saya
                                     </div>
                                 </div>
                             `;
                        }).join('')}
                    </div>
                </div>

                <div class="show-more">
                    <button class="show-more-btn">Tampilkan lainnya</button>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    // Replace the directory container content
    const directoryContainer = document.getElementById('directory-container');
    directoryContainer.innerHTML = homePageHTML;

    // Add event listeners
    addHomePageEventListeners();
}

function addHomePageEventListeners() {
    // Folder card click handlers
    document.querySelectorAll('.folder-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.folder-menu-btn')) {
                const path = card.dataset.path;
                // Directly navigate to the folder without going to Drive Saya
                getCurrentDirectory(path);
                // Update URL but stay in the context
                const currentUrl = new URL(window.location);
                currentUrl.searchParams.set('path', path);
                window.history.pushState({path: path}, '', currentUrl.toString());
            }
        });
    });

    // File item click handlers
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('dblclick', () => {
            const path = item.dataset.path;
            openFile({ target: { closest: () => ({ dataset: { path } }) } });
        });
    });

    // Menu button handlers
    document.querySelectorAll('.folder-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            // You can implement folder menu functionality here
            alert(`Menu folder dengan ID: ${id}`);
        });
    });

    // View toggle handlers
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('file-search').value;
    console.log(query)
    if (query === '') {
        alert('Search field is empty');
        return;
    }
    const path = '/?path=/search_' + encodeURI(query);
    console.log(path)
    window.location = path;
});

// Loading Main Page

document.addEventListener('DOMContentLoaded', function () {
    const inputs = ['new-folder-name', 'rename-name', 'file-search']
    for (let i = 0; i < inputs.length; i++) {
        document.getElementById(inputs[i]).addEventListener('input', validateInput);
    }

    // Setup selection notification bar buttons
    const moveSelectedBtn = document.getElementById('move-selected-btn');
    if (moveSelectedBtn) {
        moveSelectedBtn.addEventListener('click', function() {
            const selectedCount = window.selectedFiles ? window.selectedFiles.size : 0;
            if (selectedCount > 0) {
                alert(`📁 Move ${selectedCount} file(s): ${Array.from(window.selectedFiles).join(', ')}`);
                // Here you would call your move API
            } else {
                alert('❌ No files selected');
            }
        });
    }

    const deleteSelectedBtn = document.getElementById('delete-selected-btn');
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', function() {
            const deleteCount = window.selectedFiles ? window.selectedFiles.size : 0;
            if (deleteCount > 0) {
                if (confirm(`🗑️ Delete ${deleteCount} file(s)?`)) {
                    alert(`🗑️ Deleted ${deleteCount} file(s): ${Array.from(window.selectedFiles).join(', ')}`);
                    // Clear selection after delete
                    window.selectedFiles.clear();
                    updateSelectionCounter();
                }
            } else {
                alert('❌ No files selected');
            }
        });
    }

    const cancelSelectBtn = document.getElementById('cancel-select-btn');
    if (cancelSelectBtn) {
        cancelSelectBtn.addEventListener('click', function() {
            // Clear all selections manually
            if (window.selectedFiles) {
                window.selectedFiles.clear();
            }
            
            // Remove selected class from all files
            document.querySelectorAll('.file-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Remove all checkboxes
            document.querySelectorAll('.file-item .checkbox-column').forEach(cb => cb.remove());
            
            // Exit selection mode
            document.body.classList.remove('selection-mode');
            
            // Hide notification bar
            const notificationBar = document.getElementById('selection-notification-bar');
            if (notificationBar) {
                notificationBar.style.display = 'none';
            }
            
            console.log('❌ Selection cancelled from notification bar');
        });
    }

    if (getCurrentPath().includes('/share_')) {
        getCurrentDirectory()
    } else {
        if (getPassword() === null) {
            document.getElementById('bg-blur').style.zIndex = '2';
            document.getElementById('bg-blur').style.opacity = '0.1';

            document.getElementById('get-password').style.zIndex = '3';
            document.getElementById('get-password').style.opacity = '1';
        } else {
            getCurrentDirectory()
        }
    }
});
