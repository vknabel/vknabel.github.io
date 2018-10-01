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
          <Link activeClassName="active-link" to="/">
            Blog
          </Link>
        </li>
        <li>
          <Link activeClassName="active-link" to="/thoughts/">
            Thoughts
          </Link>
        </li>
        <li>
          <Link activeClassName="active-link" to="/pages/About-Me/">
            About Me
          </Link>
        </li>
        <li>
          <Link activeClassName="active-link" to="/pages/imprint/">
            Imprint
          </Link>
        </li>
      </ul>
    </nav>
  </div>
)

export default Header
