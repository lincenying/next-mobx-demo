import React from 'react'
import { Provider } from 'mobx-react'
import TopicsStore from '../store/topics'
import ArticleStore from '../store/article'
import GlobalStore from '../store/global'

export default function mobXHOC(Layouts) {
    return class PageComponent extends React.Component {
        static async getInitialProps(ctx) {
            const isServer = !!ctx.req
            const topicsStoreDefaults = TopicsStore(isServer)
            const articleStoreDefaults = ArticleStore(isServer)
            const globalStoreDefaults = GlobalStore(isServer)
            const store = { topicsStoreDefaults, articleStoreDefaults, globalStoreDefaults, isServer }
            if (Layouts.getInitialProps) {
                await Layouts.getInitialProps(ctx, store)
            }
            return store
        }

        constructor(props) {
            super(props)
            this.topicsStore = TopicsStore(props.isServer, props.topicsStoreDefaults)
            this.articleStore = ArticleStore(props.isServer, props.articleStoreDefaults)
            this.globalStore = GlobalStore(props.isServer, props.globalStoreDefaults)
        }

        render() {
            const stores = {
                Topics: this.topicsStore,
                Article: this.articleStore,
                Global: this.globalStore
            }
            return (
                <Provider {...stores}>
                    <Layouts />
                </Provider>
            )
        }
    }
}
