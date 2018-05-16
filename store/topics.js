import { observable, action } from 'mobx'
import api from '~api'

class TopicsStore {
    @observable hasNext
    @observable page
    @observable pathname
    @observable lists

    constructor(
        isServer,
        Topics = {
            hasNext: 0,
            page: 1,
            pathname: '',
            lists: []
        }
    ) {
        Object.keys(Topics).forEach(item => {
            this[item] = Topics[item]
        })
    }

    @action
    async getTopics(config) {
        const {
            data: { data, success }
        } = await api.get('https://cnodejs.org/api/v1/topics', config)
        if (success === true) {
            this.lists = config.page === 1 ? [].concat(data) : this.lists.concat(data)
            this.page = config.page || 1
            this.pathname = config.pathname
        }
    }
}

export let appStore = null

export default function initAppStore(isServer, lastUpdate) {
    if (isServer && typeof window === 'undefined') {
        return new TopicsStore(isServer, lastUpdate)
    }
    if (appStore === null) {
        appStore = new TopicsStore(isServer, lastUpdate)
    }
    return appStore
}
