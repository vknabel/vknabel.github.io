import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import ArticleHead from '../components/article-head'

const IndexPage = ({ data }) => (
  <Layout title="Blog posts">
    <h1>Blog</h1>
    {data.allMarkdownRemark.edges.map(({ node }) => node).map(node => (
      <div key={node.id}>
        <ArticleHead data={node} />
        <p>
          {node.excerpt} <Link to={node.fields.slug}>&#187;</Link>
        </p>
      </div>
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { kind: { eq: "blog" }, date: { ne: null } } }
    ) {
      totalCount
      edges {
        node {
          id
          fileAbsolutePath
          wordCount {
            paragraphs
            sentences
            words
          }
          timeToRead
          excerpt(pruneLength: 270)
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
