import { observable, action } from 'mobx'

class TopicsStore {
    @observable hasNext
    @observable page
    @observable pathname
    @observable lists

    constructor(
        api,
        isServer,
        Topics = {
            hasNext: 0,
            page: 1,
            pathname: '',
            lists: []
        }
    ) {
        Object.keys(Topics).forEach(item => {
            if (item !== '$api') this[item] = Topics[item]
        })
        this.$api = api
    }

    @action
    async getTopics(config) {
        const { data, success } = await this.$api.get('https://cnodejs.org/api/v1/topics', config)
        if (success === true) {
            this.lists = config.page === 1 ? [].concat(data) : this.lists.concat(data)
            this.page = config.page || 1
            this.pathname = config.pathname
        }
    }
}

export let appStore = null

export default function initAppStore(api, isServer, lastUpdate) {
    if (isServer && typeof window === 'undefined') {
        return new TopicsStore(api, isServer, lastUpdate)
    }
    if (appStore === null) {
        appStore = new TopicsStore(api, isServer, lastUpdate)
    }
    return appStore
}
