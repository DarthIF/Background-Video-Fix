'use strict';
(async function () {
    if (window.location.pathname !== "/watch")
        return

    const { enable_video_fix } = await browser.storage.local.get('enable_video_fix');
    if (enable_video_fix === false)
        return

    function print(message) {
        console.log(`%c> ${message}`, 'color: #00ff00; background: #000000; border-radius: 2px; padding-left: 2px; padding-right: 8px;');
    }

    print('Executando: Background Video Fix')

    function stopEvent(e) {
        if (e.type === 'visibilitychange') {
            e.stopImmediatePropagation();
            e.preventDefault();

            print('Evento bloqueado!')
        }
    }

    document.addEventListener('visibilitychange', stopEvent, true);
    window.addEventListener('visibilitychange', stopEvent, true);
})();
