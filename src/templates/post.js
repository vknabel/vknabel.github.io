import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

const Post = ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <Helmet title={post.frontmatter.title} />
      <div>
        <span className="article-head-date">{post.frontmatter.date}</span>
        <span className="article-head-tags">
          {(post.frontmatter.tags || []).map(tag => (
            <span key={tag} className="article-head-tags-item">
              #{tag}
            </span>
          ))}
        </span>
        <h2 className="article-head-title">{post.frontmatter.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.frontmatter.playground ? (
          <a href={post.frontmatter.playground.publicURL}>
            Download playground
          </a>
        ) : null}
      </div>
    </Layout>
  )
}

export default Post

export const query = graphql`
  query($slug: String!) {
    allFile(filter: { relativePath: { glob: "*.playground.zip" } }) {
      edges {
        node {
          publicURL
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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
        playground {
          publicURL
        }
      }
      fields {
        slug
      }
    }
  }
`
