import React from 'react'
import { Link } from 'gatsby'

const ArticleHead = ({ data }) => (
  <div className="article-head">
    <span className="article-head-date">{data.frontmatter.date}</span>
    <span className="article-head-tags">
      {data.frontmatter.tags.map(tag => (
        <span key={tag} className="article-head-tags-item">
          #{tag}
        </span>
      ))}
    </span>
    <Link to={data.fields.slug}>
      <h2 className="article-head-title">{data.frontmatter.title}</h2>
    </Link>
  </div>
)

export default ArticleHead
