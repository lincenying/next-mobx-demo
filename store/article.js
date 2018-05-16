import { observable, action } from 'mobx'
import api from '~api'

class ArticleStore {
    @observable pathname
    @observable data

    constructor(isServer, Article = { pathname: '', data: {} }) {
        Object.keys(Article).forEach(item => {
            this[item] = Article[item]
        })
    }

    @action
    async getArticle(config) {
        const {
            data: { data, success }
        } = await api.get('https://cnodejs.org/api/v1/topic/' + config.id, {})
        if (success === true) {
            this.data = data
            this.pathname = config.pathname
        }
    }
}

export let appStore = null

export default function initAppStore(isServer, lastUpdate) {
    if (isServer && typeof window === 'undefined') {
        return new ArticleStore(isServer, lastUpdate)
    }
    if (appStore === null) {
        appStore = new ArticleStore(isServer, lastUpdate)
    }
    return appStore
}
