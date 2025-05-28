import { Switch } from './switch.js'
import { localStorageSave, localStorageLoad } from './utils.js'

/**
 * @param {string} id 
 * @param {(checked: boolean) => void} listener 
 */
async function setupOptionItem(id) {
    const element = document.getElementById(id)
    const switchRoot = element.querySelector('.switch')
    const switchObj = new Switch(switchRoot)

    element.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()

        switchObj.toggle()
    }

    const key = id.substring(7)
    let value = await localStorageLoad(key)

    if (value === undefined)
        value = true

    switchObj.setChecked(value)
    switchObj.addListener(checked => {
        localStorageSave(key, checked)
        
        showReloadMessage()
    })
}

function showReloadMessage() {
    const element = document.querySelector('div.reload-message')
    element.classList.add('show')
}


setupOptionItem('option_enable_video_fix')

setupOptionItem('option_enable_keyboard_events')
