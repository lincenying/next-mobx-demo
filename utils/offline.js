/**
 * Registers our Service Worker on the site
 * Need more? check out:
 * https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
 */
console.log('serviceWorker file init')
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function(reg) {
            navigator.serviceWorker.addEventListener('message', e => {
                // service-worker.js 如果更新成功会 postMessage 给页面，内容为 'sw.update'
                if (e.data === 'sw.update') {
                    const metas = document.head.getElementsByTagName('meta')
                    for (let i = 0, len = metas.length; i < len; i++) {
                        const meta = metas[i]

                        if (meta.name === 'theme-color') {
                            meta.content = '#000'
                        }
                    }
                    const dom = document.createElement('div')
                    /* eslint-disable max-len */
                    dom.innerHTML = `
                        <div class="app-refresh" id="app-refresh">
                            <div class="app-refresh-wrap" onclick="location.reload()">
                                <label>发现新的版本, 请刷新加载最新版本</label>
                                <span>点击刷新</span>
                            </div>
                        </div>
                    `
                    /* eslint-enable max-len */
                    document.body.appendChild(dom)
                    setTimeout(() => {
                        document.getElementById('app-refresh').className += ' app-refresh-show'
                    }, 16)
                }
            })
            console.log('Service worker registered (0-0) ', reg)
        })
        .catch(function(e) {
            console.error('Error during service worker registration:', e)
        })
}
