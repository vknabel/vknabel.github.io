import React from 'react'
import { Link } from 'gatsby'

const Header = ({ siteTitle }) => (
  <div className="custom-header">
    <h1>
      <Link to="/">{siteTitle}</Link>
    </h1>
    <nav>
      <ul>
        <li>
          <Link to="/">Blog</Link>
        </li>
        <li>
          <Link to="/thoughts/">Thoughts</Link>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/vknabel"
          >
            Github
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/vknabel"
          >
            Twitter
          </a>
        </li>
        <li>
          <Link to="/pages/imprint/">Imprint</Link>
        </li>
      </ul>
    </nav>
  </div>
)

export default Header
