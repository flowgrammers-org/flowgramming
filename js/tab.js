/**
 * Function to open given html file in a different tab
 * If it is open already, browser shifts focus automatically
 */

function openNewTab(html, target) {
    return window.open(html, target)
}

// This is to prevent the file to be opened independently
// which might cause inconsistency in the main function
// However, localhost is excluded for dev purposes.
preventIndependentOpen = () => {
    if (window.location.hostname !== 'localhost' && !window.opener) {
        window.location.href = '/'
    }
}
