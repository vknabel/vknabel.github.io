import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'
import './custom.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Homepage of vknabel' },
            {
              name: 'keywords',
              content: 'swift, ionic, vscode, js, angular, vue',
            },
          ]}
        >
          <html lang="en" />
          <script
            async
            src="https://ack.knabel.dev/ack.js"
            data-ackee-server="https://ack.knabel.dev"
            data-ackee-domain-id="b58b1615-f9f1-4a68-9cb5-3cb947354b3a"
          />
        </Helmet>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '0px 1.0875rem 1.45rem',
            paddingTop: 0,
          }}
        >
          {children}
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
