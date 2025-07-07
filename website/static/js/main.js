function showDirectory(data) {
    data = data['contents']
    const currentPath = getCurrentPath()
    const isTrash = currentPath.startsWith('/trash')
    const isHome = currentPath === '/' || currentPath === ''
    
    // If it's home page, show suggested folders and files layout
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

    for (const [key, item] of folders) {
        if (item.type === 'folder') {
            html += `<tr data-path="${item.path}" data-id="${item.id}" class="body-tr folder-tr"><td><div class="td-align"><img src="static/assets/folder-solid-icon.svg">${item.name}</div></td><td><div class="td-align"></div></td><td><div class="td-align"><a data-id="${item.id}" class="more-btn"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td></tr>`

            if (isTrash) {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div><hr><div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div></div>`
            }
            else {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div><hr><div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div><hr><div id="folder-share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div></div>`
            }
        }
    }

    for (const [key, item] of files) {
        if (item.type === 'file') {
            const size = convertBytes(item.size)
            html += `<tr data-path="${item.path}" data-id="${item.id}" data-name="${item.name}" class="body-tr file-tr"><td><div class="td-align"><img src="static/assets/file-icon.svg">${item.name}</div></td><td><div class="td-align">${size}</div></td><td><div class="td-align"><a data-id="${item.id}" class="more-btn"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td></tr>`

            if (isTrash) {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div><hr><div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div></div>`
            }
            else {
                html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options"><input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute"><div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div><hr><div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div><hr><div id="share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div></div>`
            }
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

    document.querySelectorAll('.more-btn').forEach(div => {
        div.addEventListener('click', function (event) {
            event.preventDefault();
            openMoreButton(div)
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
    }, 120);
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

    // Create home page HTML
    const homePageHTML = `
        <div class="home-welcome">
            <h1>Selamat datang di Drive</h1>
            <button class="info-btn" style="background: none; border: none; padding: 8px; border-radius: 50%; cursor: pointer; color: #5f6368;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
            </button>
        </div>

        <!-- Suggested Folders Section -->
        <div class="suggested-section">
            <div class="section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; color: #5f6368;">
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
                <h2>Folder yang disarankan</h2>
            </div>
            <div class="suggested-folders-grid">
                ${suggestedFolders.map(([key, folder]) => `
                    <div class="folder-card" data-path="${folder.path}">
                        <div class="folder-card-content">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: #5f6368; margin-right: 12px;">
                                <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                            </svg>
                            <div class="folder-info">
                                <div class="folder-name">${folder.name}</div>
                                <div class="folder-location">Di Drive Saya</div>
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

        <!-- Suggested Files Section -->
        <div class="suggested-section">
            <div class="section-header-with-controls">
                <div class="section-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; color: #5f6368;">
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
                        
                        let timeText = "";
                        if (hoursDiff < 24) {
                            timeText = hoursDiff < 1 ? "baru saja" : `${hoursDiff} jam`;
                        } else {
                            timeText = `${daysDiff} hari`;
                        }
                        
                        return `
                            <div class="file-item" data-path="${file.path}" data-id="${file.id}">
                                <div class="file-info">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="color: #ea4335; margin-right: 12px;">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                    <span class="file-name">${file.name}</span>
                                </div>
                                <div class="file-reason">Anda menguploadnya • ${timeText}</div>
                                <div class="file-location">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #5f6368; margin-right: 4px;">
                                        <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
                                    </svg>
                                    <span>Drive Saya</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>

        <div class="show-more">
            <button class="show-more-btn">Tampilkan lainnya</button>
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
                window.location.href = `/?path=${path}`;
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
