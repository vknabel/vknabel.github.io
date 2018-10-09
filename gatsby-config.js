module.exports = {
  siteMetadata: {
    title: 'vknabel',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-127151983-1',
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ['/preview/**', '/do-not-track/me/too/'],
        cookieDomain: 'www.vknabel.com',
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
