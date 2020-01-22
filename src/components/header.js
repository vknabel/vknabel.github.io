import React from 'react'
import { Link } from 'gatsby'

const Header = ({ siteTitle }) => (
  <div className="custom-menu">
    <p>
      <Link to="/">{siteTitle}</Link>
    </p>
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
      </ul>
    </nav>
  </div>
)

export default Header
