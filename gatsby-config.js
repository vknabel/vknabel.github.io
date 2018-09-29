module.exports = {
  siteMetadata: {
    title: 'vknabel',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `contents`,
        path: `${__dirname}/contents/`,
      },
    },
    `gatsby-transformer-remark`,
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
        icon: 'src/images/vknabel.jpg', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
  ],
}
