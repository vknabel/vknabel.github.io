import React from 'react'
import { Link } from 'gatsby'

const ArticleHead = ({ data }) => (
  <div>
    <span>{data.frontmatter.date}</span>
    <span>{data.frontmatter.tags.map(tag => '#' + tag).join(' ')}</span>
    <Link to={data.fields.slug}>
      <h2>{data.frontmatter.title}</h2>
    </Link>
    <span>
      {data.timeToRead} {data.timeToRead !== 1 ? 'minutes' : 'minute'} to read
    </span>
  </div>
)

export default ArticleHead
