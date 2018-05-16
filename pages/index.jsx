import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Head from 'next/head'
import Router from 'next/router'
import ls from 'store2'
import { Link } from '@/routes'
import mobXHOC from '../components/_mobXHOC'

import '@/assets/less/index.less'

@inject('Topics')
@observer
class Topics extends Component {
    static async getInitialProps({ req, query, asPath }, { topicsStoreDefaults }) {
        const isServer = !!req
        // const cookies = isServer ? req.headers.cookie : null
        if (isServer) {
            await topicsStoreDefaults.getTopics({ pathname: asPath, ...query })
        } else {
            const { lists } = topicsStoreDefaults
            if (lists.length === 0) await topicsStoreDefaults.getTopics({ page: 1 })
        }
    }
    constructor(props) {
        super(props)
        this.handleLoadMore = this.handleLoadMore.bind(this)
        this.onScroll = this.onScroll.bind(this)
    }
    async componentDidMount() {
        const path = Router.asPath
        const scrollTop = ls.get(path) || 0
        ls.remove(path)
        if (scrollTop) {
            window.requestAnimationFrame(() => window.scrollTo(0, scrollTop))
        }
        window.addEventListener('scroll', this.onScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll)
    }
    async handleLoadMore() {
        const { page } = this.props.Topics
        await this.props.Topics.getTopics({ page: page + 1 })
    }
    onScroll() {
        const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
        const path = Router.asPath
        if (path && scrollTop) ls.set(path, scrollTop)
    }
    render() {
        const { lists } = this.props.Topics
        return (
            <div className="main">
                <Head>
                    <title>首页</title>
                </Head>
                <ul>
                    {lists.map(item => {
                        return (
                            <li key={item.id}>
                                <Link route="article" params={{ id: item.id }}>
                                    <a>{item.title}</a>
                                </Link>
                            </li>
                        )
                    })}
                    <li>
                        <a onClick={this.handleLoadMore} href="JavaScript:;">
                            加载下一页
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}
export default mobXHOC(Topics)
