import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import Footer from './footer'
import './layout.css'
import './custom.css'

const Layout = ({ children, title, tags, description }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            pageTitle
            fullTitle
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={
            title
              ? `${title} | ${data.site.siteMetadata.fullTitle}`
              : data.site.siteMetadata.fullTitle
          }
          meta={[
            {
              name: 'description',
              content:
                description || 'Blog posts and thoughts of Valentin Knabel.',
            },
            {
              name: 'keywords',
              content: (
                tags || ['swift', 'ionic', 'vscode', 'js', 'angular', 'vue']
              ).join(', '),
            },
          ]}
        >
          <html lang="en" />
          <script
            async
            src="https://ack.knabel.dev/ack.js"
            data-ackee-server="https://ack.knabel.dev"
            data-ackee-domain-id="b58b1615-f9f1-4a68-9cb5-3cb947354b3a"
            data-ackee-opts='{ "ignoreLocalhost": true, detailed: true }'
          />
        </Helmet>
        <Header siteTitle={data.site.siteMetadata.pageTitle} />
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
        <Footer />
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
