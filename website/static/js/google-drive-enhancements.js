// Google Drive UI Enhancements
class DriveEnhancements {
    constructor() {
        this.currentView = 'list';
        this.currentPath = '/';
        this.init();
    }

    init() {
        this.setupViewToggle();
        this.setupBreadcrumb();
        this.setupKeyboardShortcuts();
        this.enhanceSelectionMode();
        this.enhanceSearch();
    }

    // View Toggle (List/Grid)
    setupViewToggle() {
        const listViewBtn = document.getElementById('list-view-btn');
        const gridViewBtn = document.getElementById('grid-view-btn');
        const directoryContainer = document.getElementById('directory-container');

        if (listViewBtn && gridViewBtn) {
            listViewBtn.addEventListener('click', () => {
                this.switchToListView();
            });

            gridViewBtn.addEventListener('click', () => {
                this.switchToGridView();
            });
        }
    }

    switchToListView() {
        this.currentView = 'list';
        document.getElementById('list-view-btn').classList.add('active');
        document.getElementById('grid-view-btn').classList.remove('active');
        document.getElementById('directory-container').classList.remove('grid-view');
        
        // Show table headers
        document.querySelector('.directory table thead').style.display = 'table-header-group';
    }

    switchToGridView() {
        this.currentView = 'grid';
        document.getElementById('grid-view-btn').classList.add('active');
        document.getElementById('list-view-btn').classList.remove('active');
        document.getElementById('directory-container').classList.add('grid-view');
        
        // Hide table headers in grid view
        document.querySelector('.directory table thead').style.display = 'none';
        
        // Convert table rows to grid cards
        this.convertToGridCards();
    }

    convertToGridCards() {
        const tbody = document.getElementById('directory-data');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (!row.classList.contains('grid-card-converted')) {
                const nameCell = row.querySelector('.file-name');
                const icon = row.querySelector('.file-icon img');
                const moreBtn = row.querySelector('.more-btn');
                
                if (nameCell && icon) {
                    // Add grid card class
                    row.classList.add('file-card', 'grid-card-converted');
                    
                    // Restructure content for grid view
                    const fileName = nameCell.textContent.trim();
                    const fileType = row.dataset.type;
                    
                    row.innerHTML = `
                        <td colspan="4" class="grid-card-content">
                            <div class="file-card-icon">
                                ${icon.outerHTML}
                            </div>
                            <div class="file-card-name">${fileName}</div>
                            <div class="file-card-actions">
                                ${moreBtn ? moreBtn.outerHTML : ''}
                            </div>
                        </td>
                    `;
                }
            }
        });
    }

    // Enhanced Breadcrumb Navigation
    setupBreadcrumb() {
        this.updateBreadcrumb();
    }

    updateBreadcrumb(path = '/') {
        this.currentPath = path;
        const breadcrumbNav = document.getElementById('breadcrumb-nav');
        
        if (!breadcrumbNav) return;

        const pathParts = path.split('/').filter(part => part.length > 0);
        let breadcrumbHTML = `
            <a href="/?path=/" class="breadcrumb-item ${path === '/' ? 'current' : ''}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                </svg>
                My Drive
            </a>
        `;

        let currentPath = '';
        pathParts.forEach((part, index) => {
            currentPath += '/' + part;
            const isLast = index === pathParts.length - 1;
            
            breadcrumbHTML += `
                <span class="breadcrumb-separator">/</span>
                <a href="/?path=${encodeURIComponent(currentPath)}" 
                   class="breadcrumb-item ${isLast ? 'current' : ''}">${part}</a>
            `;
        });

        breadcrumbNav.innerHTML = breadcrumbHTML;
    }

    // Enhanced Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't process if user is typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case '1':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.switchToListView();
                    }
                    break;
                
                case '2':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.switchToGridView();
                    }
                    break;

                case '/':
                    e.preventDefault();
                    document.getElementById('file-search').focus();
                    break;

                case 'Escape':
                    // Clear search
                    const searchInput = document.getElementById('file-search');
                    if (searchInput.value) {
                        searchInput.value = '';
                        // Trigger search clear
                        if (typeof clearSearch === 'function') {
                            clearSearch();
                        }
                    }
                    break;
            }
        });
    }

    // Enhanced Selection Mode
    enhanceSelectionMode() {
        const selectModeBtn = document.getElementById('select-mode-btn');
        const cancelSelectBtn = document.getElementById('cancel-select-btn');
        const moveFilesBtn = document.getElementById('move-files-btn');
        const selectAllCheckbox = document.getElementById('select-all-checkbox');

        if (selectModeBtn) {
            selectModeBtn.addEventListener('click', () => {
                // Use more menu manager for consistency
                if (window.moreMenuManager) {
                    window.moreMenuManager.enterSelectionMode();
                } else {
                    this.enterSelectionMode();
                }
            });
        }

        if (cancelSelectBtn) {
            cancelSelectBtn.addEventListener('click', () => {
                // Use more menu manager for consistency
                if (window.moreMenuManager) {
                    window.moreMenuManager.exitSelectionMode();
                } else {
                    this.exitSelectionMode();
                }
            });
        }

        if (moveFilesBtn) {
            // Remove existing event listeners to prevent conflicts
            const newMoveBtn = moveFilesBtn.cloneNode(true);
            moveFilesBtn.parentNode.replaceChild(newMoveBtn, moveFilesBtn);
            
            newMoveBtn.addEventListener('click', () => {
                console.log('🔄 Move button clicked from google-drive-enhancements');
                
                // Use more menu manager for move functionality
                if (window.moreMenuManager && window.moreMenuManager.selectedFiles.size > 0) {
                    console.log('✅ Using MoreMenuManager for move');
                    window.moreMenuManager.moveSelectedFiles();
                } else {
                    console.log('⚠️ No files selected in MoreMenuManager');
                    if (window.googleDriveUI && window.googleDriveUI.showToast) {
                        window.googleDriveUI.showToast('Please select files to move', 'warning');
                    }
                }
            });
        }

        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }
    }

    enterSelectionMode() {
        document.body.classList.add('selection-mode');
        
        // Show checkbox column and selection buttons
        document.querySelectorAll('.checkbox-column').forEach(el => {
            el.classList.remove('hidden');
        });
        
        document.getElementById('select-mode-btn').classList.add('hidden');
        document.getElementById('cancel-select-btn').classList.remove('hidden');
        
        // Add checkboxes to file rows
        this.addFileCheckboxes();
    }

    exitSelectionMode() {
        document.body.classList.remove('selection-mode');
        
        // Hide checkbox column and selection buttons
        document.querySelectorAll('.checkbox-column').forEach(el => {
            el.classList.add('hidden');
        });
        
        document.getElementById('select-mode-btn').classList.remove('hidden');
        document.getElementById('cancel-select-btn').classList.add('hidden');
        document.getElementById('move-files-btn').classList.add('disabled');
        document.getElementById('move-files-btn').disabled = true;
        
        // Clear selections
        this.clearAllSelections();
        
        // Update counter
        document.getElementById('selected-count-header').textContent = '0';
        
        // 🔧 BUG FIX INTEGRATION: Call directNuclearClear for comprehensive fixes
        console.log('🔧 google-drive-enhancements: Calling directNuclearClear() to fix post-cancel bugs...');
        if (window.directNuclearClear && typeof window.directNuclearClear === 'function') {
            try {
                window.directNuclearClear();
                console.log('✅ google-drive-enhancements: directNuclearClear() completed');
            } catch (error) {
                console.warn('⚠️ google-drive-enhancements: directNuclearClear() failed:', error);
            }
        } else {
            console.warn('⚠️ google-drive-enhancements: directNuclearClear() not available');
        }
    }

    addFileCheckboxes() {
        const rows = document.querySelectorAll('#directory-data tr[data-path]');
        rows.forEach(row => {
            const firstCell = row.querySelector('td');
            if (firstCell && !firstCell.querySelector('.file-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'file-checkbox';
                checkbox.addEventListener('change', (e) => {
                    this.handleFileCheckboxChange(row, e.target.checked);
                });
                
                // Insert checkbox at the beginning
                const checkboxCell = document.createElement('td');
                checkboxCell.appendChild(checkbox);
                row.insertBefore(checkboxCell, firstCell);
            }
        });
    }

    handleFileCheckboxChange(row, checked) {
        if (checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
        
        this.updateSelectionCount();
    }

    toggleSelectAll(selectAll) {
        const checkboxes = document.querySelectorAll('.file-checkbox');
        
        if (window.moreMenuManager) {
            // Use more menu manager for consistency
            if (selectAll) {
                // Select all files
                document.querySelectorAll('#directory-data tr[data-path]').forEach(row => {
                    window.moreMenuManager.selectedFiles.add(row.dataset.path);
                    row.classList.add('selected');
                });
            } else {
                // Deselect all files
                window.moreMenuManager.selectedFiles.clear();
                document.querySelectorAll('#directory-data tr.selected').forEach(row => {
                    row.classList.remove('selected');
                });
            }
            
            // Update checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll;
            });
            
            // Update counts and UI
            window.moreMenuManager.updateSelectionCount();
            window.moreMenuManager.updateAllMoreMenus();
        } else {
            // Fallback to original method
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAll;
                const row = checkbox.closest('tr');
                if (row) {
                    this.handleFileCheckboxChange(row, selectAll);
                }
            });
        }
    }

    clearAllSelections() {
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.querySelectorAll('#directory-data tr.selected').forEach(row => {
            row.classList.remove('selected');
        });
        document.getElementById('select-all-checkbox').checked = false;
    }

    updateSelectionCount() {
        const selectedCount = document.querySelectorAll('#directory-data tr.selected').length;
        document.getElementById('selected-count-header').textContent = selectedCount;
        
        const moveBtn = document.getElementById('move-files-btn');
        if (selectedCount > 0) {
            moveBtn.classList.remove('disabled');
            moveBtn.disabled = false;
        } else {
            moveBtn.classList.add('disabled');
            moveBtn.disabled = true;
        }
    }
    
    // Enhance newly added files after directory refresh
    enhanceNewFiles() {
        // Re-add data attributes for new table rows
        document.querySelectorAll('#directory-data tr[data-path]').forEach(row => {
            // Add file-name class to name cell for double-click rename
            const nameCell = row.querySelector('td .td-align');
            if (nameCell && !nameCell.classList.contains('file-name')) {
                nameCell.classList.add('file-name');
            }
            
            // Ensure row has proper classes for context detection
            if (!row.classList.contains('file-item')) {
                row.classList.add('file-item');
            }
            
            // Add data-type attribute if missing
            if (!row.dataset.type) {
                if (row.classList.contains('folder-tr')) {
                    row.dataset.type = 'folder';
                } else if (row.classList.contains('file-tr')) {
                    row.dataset.type = 'file';
                }
            }
            
            // Add data-name attribute if missing
            if (!row.dataset.name && nameCell) {
                const fileName = nameCell.textContent.trim();
                row.dataset.name = fileName;
            }
        });
        
        // If in selection mode, add checkboxes to new files
        if (document.body.classList.contains('selection-mode')) {
            if (window.moreMenuManager) {
                window.moreMenuManager.addCheckboxesToFiles();
            } else {
                this.addFileCheckboxes();
            }
        }
        
        // Update more menus for new files
        if (window.moreMenuManager) {
            window.moreMenuManager.updateAllMoreMenus();
        }
        
        // Update view if in grid mode
        if (this.currentView === 'grid') {
            this.convertToGridCards();
        }
        
        // Re-enable enhanced search
        this.enhanceSearch();
    }

    // File preview functionality
    showFilePreview(filePath, fileName) {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const previewableImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const previewableVideos = ['mp4', 'webm', 'ogg'];
        const previewableAudio = ['mp3', 'wav', 'ogg', 'm4a'];

        if (previewableImages.includes(fileExtension)) {
            this.showImagePreview(filePath, fileName);
        } else if (previewableVideos.includes(fileExtension)) {
            this.showVideoPreview(filePath, fileName);
        } else if (previewableAudio.includes(fileExtension)) {
            this.showAudioPreview(filePath, fileName);
        } else {
            // Fallback to download
            window.open(`/api/getFile?path=${encodeURIComponent(filePath)}`, '_blank');
        }
    }

    showImagePreview(filePath, fileName) {
        // Create modal for image preview
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <h3>${fileName}</h3>
                    <button class="preview-close">&times;</button>
                </div>
                <div class="preview-body">
                    <img src="/api/getFile?path=${encodeURIComponent(filePath)}" alt="${fileName}" />
                </div>
                <div class="preview-footer">
                    <button onclick="window.open('/api/getFile?path=${encodeURIComponent(filePath)}&download=true')">
                        Download
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal events
        modal.querySelector('.preview-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }

    // Animation helpers
    animateFileOperation(element, operation) {
        element.style.transition = 'all 0.3s ease';
        
        switch (operation) {
            case 'delete':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-100%)';
                setTimeout(() => element.remove(), 300);
                break;
                
            case 'move':
                element.style.transform = 'translateX(100%)';
                element.style.opacity = '0';
                setTimeout(() => element.remove(), 300);
                break;
                
            case 'add':
                element.style.opacity = '0';
                element.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
                break;
        }
    }

    // Enhanced search functionality
    enhanceSearch() {
        const searchInput = document.getElementById('file-search');
        
        // Only add event listener if not already added
        if (!searchInput.hasAttribute('data-search-enhanced')) {
            searchInput.setAttribute('data-search-enhanced', 'true');
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        }
    }

    performSearch(query) {
        const rows = document.querySelectorAll('#directory-data tr[data-path]');
        
        if (!query.trim()) {
            rows.forEach(row => row.style.display = '');
            return;
        }

        rows.forEach(row => {
            const fileName = row.dataset.name || '';
            const isMatch = fileName.toLowerCase().includes(query.toLowerCase());
            row.style.display = isMatch ? '' : 'none';
        });
    }
}

// Initialize enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.driveEnhancements = new DriveEnhancements();
});

// Hook into existing functions to update breadcrumb
if (typeof openFolder === 'function') {
    const originalOpenFolder = openFolder;
    openFolder = function(path) {
        const result = originalOpenFolder.apply(this, arguments);
        if (window.driveEnhancements) {
            window.driveEnhancements.updateBreadcrumb(path);
        }
        return result;
    };
}