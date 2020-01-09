import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import ArticleHead from '../components/article-head'

const SecondPage = ({ data }) => (
  <Layout title="Thoughts and non-finished blog posts">
    <h1>Thoughts</h1>
    <p>
      This is a collection of thoughts, reviews and unfinished work. These blog
      posts are less official and may lack actual introductions or descriptions.
      If wish additional explanation or examples, you are free to contact me.
      All code is{' '}
      <a
        href="https://choosealicense.com/licenses/mit/"
        target="_blank"
        rel="noopener noreferrer"
      >
        MIT
      </a>
      -licensed and I would be really happy if my experiments can help you.
    </p>
    {data.allMarkdownRemark.edges.map(({ node }) => node).map(node => (
      <div key={node.id}>
        <ArticleHead data={node} />
        <p>
          {node.excerpt}{' '}
          <Link to={node.fields.slug} title={node.frontmatter.title}>
            &#187;
          </Link>
        </p>
      </div>
    ))}
  </Layout>
)

export default SecondPage

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { kind: { eq: "thought" }, date: { ne: null } } }
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
