import React from 'react'
import { Link } from 'gatsby'

const ArticleHead = ({ data }) => (
  <article className="article-head">
    <span className="article-head-date">
      <time dateTime={data.frontmatter.date}>{data.frontmatter.date}</time>
    </span>
    <span className="article-head-tags">
      {data.frontmatter.tags.map(tag => (
        <span key={tag} className="article-head-tags-item">
          #{tag}
        </span>
      ))}
    </span>
    <Link to={data.fields.slug} title={data.frontmatter.title}>
      <h2 className="article-head-title">{data.frontmatter.title}</h2>
    </Link>
  </article>
)

export default ArticleHead
