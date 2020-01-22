module.exports = {
  siteMetadata: {
    pageTitle: 'vknabel',
    fullTitle: 'Valentin Knabel',
    siteUrl:
      process.env.GATSBY_BUILD_STAGE === 'develop'
        ? `http://localhost:8100/`
        : `https://www.vknabel.com/`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
        {
          site {
            siteMetadata {
              title: fullTitle
              siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                })
              })
            },
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { frontmatter: { date: { ne: null } } }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: 'Valentin Knabel',
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `contents`,
        path: `${__dirname}/contents/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [{ resolve: `gatsby-remark-prismjs` }],
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'vknabel',
        short_name: 'vknabel',
        start_url: '/',
        background_color: '#f05138',
        theme_color: '#f05138',
        display: 'minimal-ui',
        icon: 'static/images/vknabel.jpg',
      },
    },
  ],
}
