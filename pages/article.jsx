import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import Link from 'next/link'
import Head from 'next/head'
// import Router from 'next/router'

import mobXHOC from '../components/_mobXHOC'

@inject('Article')
@observer
class Article extends Component {
    static async getInitialProps({ req, query, asPath }, { articleStoreDefaults }) {
        const isServer = !!req
        // const cookies = isServer ? req.headers.cookie : null
        if (isServer) {
            await articleStoreDefaults.getArticle({ id: query.id, pathname: asPath })
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
                <p>
                    <Link href={'/'}>
                        <a>返回列表</a>
                    </Link>
                </p>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: data.content }} />
                <div className="reply">
                    {data.replies &&
                        data.replies.map(sub_item => {
                            return (
                                <div key={sub_item.id} className="reply-item">
                                    <h5>
                                        {sub_item.author.loginname}: <span>[{data.create_at}]</span>
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
                <style jsx>{`
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
                        border-bottom: 1px dashed #ccc;
                    }
                    .reply-item h5 span {
                        font-weight: 400;
                        font-size: 12px;
                    }
                `}</style>
                <style jsx global>{`
                    pre {
                        overflow: auto;
                    }
                    .article-content img,
                    .reply-item-content img {
                        max-width: 100%;
                    }
                `}</style>
            </div>
        )
    }
}
export default mobXHOC(Article)
