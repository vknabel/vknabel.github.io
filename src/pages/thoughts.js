import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import ArticleHead from '../components/article-head'

const SecondPage = ({ data }) => (
  <Layout>
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    {data.allMarkdownRemark.edges.map(({ node }) => node).map(node => (
      <div key={node.id}>
        <ArticleHead data={node} />
        <p>{node.excerpt}</p>
      </div>
    ))}
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { kind: { eq: "thought" }, date: { ne: "no" } } }
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
