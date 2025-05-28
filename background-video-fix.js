'use strict';
(function () {
    const SETTINGS = {
        ENABLED_VIDEO_FIX: false,
        ENABLED_KEYBOARD_EVENTS: false
    }
    let RUNNING_LOOP = false

    async function loadSettings() {
        const storageAPI = browser.storage.local
        let { enable_video_fix, enable_keyboard_events } = await storageAPI.get(['enable_video_fix', 'enable_keyboard_events'])
        let initialValue = false


        if (typeof enable_video_fix === 'undefined') {
            enable_video_fix = true
            initialValue = true
        }
        if (typeof enable_keyboard_events === 'undefined') {
            enable_keyboard_events = true
            initialValue = true
        }


        if (initialValue) {
            await storageAPI.set({ enable_video_fix, enable_keyboard_events })
            print('the initial values were set')
        }


        SETTINGS.ENABLED_VIDEO_FIX = enable_video_fix
        SETTINGS.ENABLED_KEYBOARD_EVENTS = enable_keyboard_events


        storageAPI.onChanged.addListener((changes) => {
            // Background Video Fix
            if (changes.enable_video_fix) {
                const newValue = changes.enable_video_fix.newValue
                const oldValue = changes.enable_video_fix.oldValue

                SETTINGS.ENABLED_VIDEO_FIX = newValue

                if (newValue === true) {
                    print('OnChanged: Next events will be blocked!')
                } else {
                    print('OnChanged: Next events will not be blocked!')
                }
            }

            // Keyboard events
            if (changes.enable_keyboard_events) {
                const newValue = changes.enable_keyboard_events.newValue;
                const oldValue = changes.enable_keyboard_events.oldValue;

                SETTINGS.ENABLED_KEYBOARD_EVENTS = newValue

                if (newValue === true) {
                    print('OnChanged: Starting keyboard events loop.')
                    callLoopPressKey()
                } else {
                    print('OnChanged: Keyboard events loop will not be executed.')
                }
            }
        });
    }

    function print(message) {
        console.log(`%c> ${message}`, 'color: #00ff00; background: #000000; border-radius: 2px; padding-left: 2px; padding-right: 8px;');
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

    function sendKeyEvent(eventType, targetKeyCode) {
        document.dispatchEvent(new KeyboardEvent(eventType, {
            bubbles: true,
            cancelable: true,
            keyCode: targetKeyCode,
            which: targetKeyCode,
        }))
    }
    function pressKey(keyCode) {
        print('Send keydown and keyup events: keycode=' + keyCode)

        sendKeyEvent('keydown', keyCode)
        sendKeyEvent('keyup', keyCode)
    }
    function loopPressKey() {
        if (!SETTINGS.ENABLED_KEYBOARD_EVENTS) {
            print('Running: loopPressKey is not running')
            return
        }

        const keyCodes = [16, 17, 18]
        let key = keyCodes[getRandomInt(0, keyCodes.length)]

        pressKey(key)

        // Set random interval between 30s (30000 ms) and 60s (60000 ms)
        const time = getRandomInt(30000, 60000)
        window.setTimeout(loopPressKey, time)
    }
    function callLoopPressKey(timeout = 0) {
        if (RUNNING_LOOP) {
            print('There is already a loop running, please wait.')
            return
        }

        if (timeout === 0)
            loopPressKey()
        else
            window.setTimeout(loopPressKey, timeout)
    }


    function stopEvent(e) {
        if (window.location.pathname !== "/watch")
            return

        if (e.type === 'visibilitychange' && SETTINGS.ENABLED_VIDEO_FIX) {
            e.stopImmediatePropagation()
            e.preventDefault()

            print('Event blocked!')
        }
    }

    function main() {
        print('Running: Background Video Fix')

        document.addEventListener('visibilitychange', stopEvent, true)
        window.addEventListener('visibilitychange', stopEvent, true)

        print('Running: added event listener')

        callLoopPressKey(12000)
        print('Running: loopPressKey will be called in 12 seconds')
    }

    loadSettings()
    main()
})();