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
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  )
}

export default Post

export const query = graphql`
  query($slug: String!) {
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
      }
      fields {
        slug
      }
    }
  }
`
