const el_button = document.getElementById('button')
const el_status = document.getElementById('status')
const el_reload_message = document.getElementById('reload_message')
let current_status = true

function updateUI(enabled, first) {
    el_button.textContent = enabled ? 'Disable fix' : 'Enable fix'
    el_status.textContent = 'Status: ' + (enabled ? 'Enabled' : 'Disabled')

    el_status.dataset.enabled = enabled

    if (!first)
        el_reload_message.classList.add('show')
}

function setEnabled(enabled) {
    browser.storage.local.set({ enable_video_fix: enabled });
    updateUI(enabled);
}

browser.storage.local.get('enable_video_fix').then((result) => {
    current_status = result.enable_video_fix ?? true;
    updateUI(current_status, true);

    el_button.addEventListener('click', () => {
        current_status = !current_status
        setEnabled(current_status)
    });
});