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
