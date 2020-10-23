import { action, observable } from 'mobx'

class ArticleStore {
    @observable
    pathname
    @observable
    data

    constructor(api, isServer, Article = { pathname: '', data: {} }) {
        Object.keys(Article).forEach(item => {
            if (item !== '$api') this[item] = Article[item]
        })
        this.$api = api
    }

    @action
    async getArticle(config) {
        const { data, success } = await this.$api.get('/api/v1/topic/' + config.id, {})
        if (success === true) {
            this.data = data
            this.pathname = config.pathname
        }
    }
}

export let appStore = null

export default function initAppStore(api, isServer, lastUpdate) {
    if (isServer && typeof window === 'undefined') {
        return new ArticleStore(api, isServer, lastUpdate)
    }
    if (appStore === null) {
        appStore = new ArticleStore(api, isServer, lastUpdate)
    }
    return appStore
}
