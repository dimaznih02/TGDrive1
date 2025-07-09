// 🔍 DEBUG SCRIPT untuk Fitur Pilih
// Jalankan script ini di Browser Console untuk debug

console.log('🚀 Starting comprehensive debug for selection functionality...');

// 1. Check if all JavaScript files are loaded
console.log('\n📁 1. CHECKING JAVASCRIPT FILES:');
console.log('moveFiles system ready:', window.moveFilesSystemReady);
console.log('startSelectionWithFile function:', typeof window.startSelectionWithFile);
console.log('handleFileSelection function:', typeof window.handleFileSelection);
console.log('showContextMenu function:', typeof showContextMenu);

// 2. Check DOM elements
console.log('\n🏗️ 2. CHECKING DOM ELEMENTS:');
const fileItems = document.querySelectorAll('.file-item');
console.log('File items found:', fileItems.length);

fileItems.forEach((item, index) => {
    console.log(`File ${index}:`, {
        name: item.getAttribute('data-name'),
        path: item.getAttribute('data-path'),
        type: item.getAttribute('data-type'),
        classes: item.className
    });
});

// 3. Check notification bar
const notificationBar = document.getElementById('selection-notification-bar');
console.log('Notification bar element:', notificationBar);
console.log('Notification bar style display:', notificationBar?.style?.display);

// 4. Check body classes and styles
console.log('\n🎨 3. CHECKING BODY ELEMENT:');
console.log('Body classes:', document.body.className);
console.log('Body has selection-mode class:', document.body.classList.contains('selection-mode'));

// 5. Test manual selection
console.log('\n🧪 4. TESTING MANUAL SELECTION:');

function testManualSelection() {
    console.log('Testing manual selection...');
    
    const firstFileItem = document.querySelector('.file-item');
    if (!firstFileItem) {
        console.error('❌ No file items found!');
        return;
    }
    
    console.log('Selected file item for test:', firstFileItem.getAttribute('data-name'));
    
    // Try to manually call the selection function
    try {
        if (window.startSelectionWithFile) {
            console.log('✅ Calling startSelectionWithFile...');
            window.startSelectionWithFile(firstFileItem);
        } else {
            console.error('❌ startSelectionWithFile function not available');
        }
    } catch (error) {
        console.error('❌ Error calling startSelectionWithFile:', error);
    }
}

// 6. Check for JavaScript errors
console.log('\n❗ 5. CHECKING FOR ERRORS:');
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error detected:', e.error);
});

// 7. Test context menu
console.log('\n🖱️ 6. TESTING CONTEXT MENU:');
function testContextMenu() {
    const firstFileItem = document.querySelector('.file-item');
    if (firstFileItem) {
        const fileName = firstFileItem.getAttribute('data-name');
        const fileType = firstFileItem.getAttribute('data-type');
        const filePath = firstFileItem.getAttribute('data-path');
        
        console.log('Testing context menu with:', {fileName, fileType, filePath});
        
        try {
            if (typeof showContextMenu === 'function') {
                // Create fake event
                const fakeEvent = {
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    clientX: 100,
                    clientY: 100
                };
                
                showContextMenu(fakeEvent, fileName, fileType, filePath);
                console.log('✅ Context menu test successful');
            } else {
                console.error('❌ showContextMenu function not available');
            }
        } catch (error) {
            console.error('❌ Context menu test failed:', error);
        }
    }
}

// 8. CSS Check
console.log('\n🎨 7. CHECKING CSS:');
const computedStyle = window.getComputedStyle(document.body);
console.log('Body computed background:', computedStyle.backgroundColor);
console.log('Body computed classes applied:', computedStyle.getPropertyValue('--tw-bg-opacity')); // Tailwind check

// 9. Event listeners check
console.log('\n👂 8. CHECKING EVENT LISTENERS:');
const fileItem = document.querySelector('.file-item');
if (fileItem) {
    console.log('First file item event listeners count:', getEventListeners ? getEventListeners(fileItem) : 'getEventListeners not available in this browser');
}

// Run tests
console.log('\n🏃 RUNNING TESTS...');
testManualSelection();
setTimeout(() => {
    testContextMenu();
}, 1000);

console.log('\n✅ Debug script completed. Check the results above.');
console.log('\n💡 To run manual test, execute: testManualSelection()');
console.log('💡 To test context menu, execute: testContextMenu()');

// Export functions for manual testing
window.debugTestManualSelection = testManualSelection;
window.debugTestContextMenu = testContextMenu;