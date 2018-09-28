import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import ArticleHead from '../components/article-head'

const IndexPage = ({ data }) => (
  <Layout>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    {data.allMarkdownRemark.edges.map(({ node }) => node).map(node => (
      <div key={node.id}>
        <ArticleHead data={node} />
        <p>{node.excerpt}</p>
      </div>
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { kind: { eq: "blog" }, date: { ne: "no" } } }
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
