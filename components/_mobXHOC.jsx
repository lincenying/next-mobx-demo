import React from 'react'
import { Provider } from 'mobx-react'
import { api } from '~api'
import TopicsStore from '../store/topics'
import ArticleStore from '../store/article'
import GlobalStore from '../store/global'

export default function mobXHOC(Layouts) {
    return class PageComponent extends React.Component {
        static async getInitialProps(ctx) {
            const isServer = !!ctx.req
            const cookies = isServer ? ctx.req.cookies : {}
            const topicsStoreDefaults = TopicsStore(api(cookies), isServer)
            const articleStoreDefaults = ArticleStore(api(cookies), isServer)
            const globalStoreDefaults = GlobalStore(api(cookies), isServer)
            const store = { topicsStoreDefaults, articleStoreDefaults, globalStoreDefaults, isServer, cookies }
            if (Layouts.getInitialProps) {
                await Layouts.getInitialProps(ctx, store)
            }
            return store
        }

        constructor(props) {
            super(props)
            this.topicsStore = TopicsStore(api(props.cookies), props.isServer, props.topicsStoreDefaults)
            this.articleStore = ArticleStore(api(props.cookies), props.isServer, props.articleStoreDefaults)
            this.globalStore = GlobalStore(api(props.cookies), props.isServer, props.globalStoreDefaults)
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
