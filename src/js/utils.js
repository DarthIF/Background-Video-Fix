function log_no_storage() {
    console.error('Without storage permission, changes will not be saved')
}


export async function localStorageLoad(key) {
    if (typeof browser === 'undefined' || typeof browser.storage === 'undefined' || typeof browser.storage.local === 'undefined') {
        log_no_storage()
        return undefined
    }

    try {
        const storage_content = await browser.storage.local.get(key)
        if (storage_content instanceof Object === false)
            return undefined

        return storage_content[key] ?? undefined
    } catch (e) {
    }
}

export async function localStorageSave(key, value) {
    if (typeof browser === 'undefined' || typeof browser.storage === 'undefined' || typeof browser.storage.local === 'undefined') {
        log_no_storage()
        return undefined
    }

    return browser.storage.local.set({ [key]: value })
}

export async function localStorageDelete(key) {
    if (typeof browser === 'undefined' || typeof browser.storage === 'undefined' || typeof browser.storage.local === 'undefined') {
        log_no_storage()
        return undefined
    }

    return browser.storage.local.remove(key)
}