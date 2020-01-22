import React from 'react'
import { Link } from 'gatsby'

const Footer = () => (
  <div className="custom-menu">
    <footer>
      <ul>
        <li>
          <a
            href="https://twitter.com/vknabel"
            rel="noopener noreferrer"
            target="_blank"
          >
            Twitter
          </a>
          {' | '}
          <a
            href="https://github.com/vknabel"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          {' | '}
          <a href="/rss.xml" rel="alternate" type="application/rss+xml">
            RSS
          </a>
          {' | '}
          <Link to="/pages/imprint/">Imprint</Link>
        </li>
      </ul>
    </footer>
  </div>
)

export default Footer
