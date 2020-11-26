/* eslint-disable react/require-optimization */

import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { inject, observer } from 'mobx-react'

import { Affix } from 'antd'
// import Router from 'next/router'
import mobXHOC from '../components/_mobXHOC.jsx'

import '@/assets/scss/index.scss'
import css from 'styled-jsx/css'

const globalCss = css`
    pre {
        overflow: auto;
    }
`
const scopeCss = css`
    h3 {
        text-align: center;
    }
    .article-content {
        word-wrap: break-word;
    }
    .reply {
        border-top: 1px solid #ccc;
    }
    .reply-item {
        padding-top: 8px;
        border-bottom: 1px dashed #ccc;
    }
`

@inject('Article')
@observer
class Article extends Component {
    static async getInitialProps({ req, query, asPath }, { articleStoreDefaults }) {
        const isServer = !!req
        if (isServer) {
            await articleStoreDefaults.getArticle({ id: query.id, pathname: asPath, cache: 1 })
        } else {
            const { pathname } = articleStoreDefaults
            if (pathname !== asPath) await articleStoreDefaults.getArticle({ id: query.id, pathname: asPath })
        }
    }
    constructor(props) {
        super(props)
    }
    async componentDidMount() {}
    render() {
        const { data } = this.props.Article
        return (
            <div className="main">
                <Head>
                    <title>{data.title}</title>
                </Head>
                <h3>{data.title}</h3>
                <Affix offsetTop={20}>
                    <p>
                        <Link href={'/'}>
                            <a>返回列表</a>
                        </Link>
                    </p>
                </Affix>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: data.content }} />
                <div className="reply">
                    {data.replies &&
                        data.replies.map(sub_item => {
                            return (
                                <div key={sub_item.id} className="reply-item">
                                    <h5>
                                        {sub_item?.author?.loginname}: <span>[{data.create_at}]</span>
                                    </h5>
                                    <div
                                        className="reply-item-content"
                                        dangerouslySetInnerHTML={{
                                            __html: sub_item.content
                                        }}
                                    />
                                </div>
                            )
                        })}
                </div>
                <style jsx global>
                    {globalCss}
                </style>
                <style jsx>{scopeCss}</style>
            </div>
        )
    }
}
export default mobXHOC(Article)
