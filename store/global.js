import { action, observable } from 'mobx'

class GlobalStore {
    @observable
    title

    constructor(api, isServer, Global = { title: 'M.M.F小屋' }) {
        Object.keys(Global).forEach(item => {
            this[item] = Global[item]
        })
    }

    @action
    async setTitle(payload) {
        this.title = payload
    }
}

export let appStore = null

export default function initAppStore(isServer, lastUpdate) {
    if (isServer && typeof window === 'undefined') {
        return new GlobalStore(isServer, lastUpdate)
    }
    if (appStore === null) {
        appStore = new GlobalStore(isServer, lastUpdate)
    }
    return appStore
}
