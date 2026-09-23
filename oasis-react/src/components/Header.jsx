import { Link } from 'react-router-dom';
export default function Header() {
  return (
    <nav>
      <div className="container nav__container">
        
        {/* 1. Logo */}
        <Link to="/discover" className="nav__logo">
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" />
        </Link>

        {/* 2. Center menu (desktop) / sliding panel (mobile) */}
        <ul className="nav__items">
          <li><button id="close__nav-btn">✕</button></li>
          <li><Link to="/discover" className="active">Discover</Link></li>
          <li><Link to="/following">Following</Link></li>
          <li><Link to="/popular">Popular</Link></li>
          <li><Link to="/topics">Topics</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        {/* 3. Right side: search, notifications, avatar, burger */}
        <div className="nav__actions">
          <form action="/search" method="GET" className="search-bar">
            <img loading="lazy" src="/assets/images/icons/search.svg" alt="Search" />
            <input type="text" placeholder="Search stories..." aria-label="Search stories" />
          </form>

          <Link to="/notifications" className="notification-btn" aria-label="Notifications">
            <img loading="lazy" src="/assets/images/icons/notification_icon.svg" alt="Notifications" />
          </Link>

          <Link to="/dashboard" className="avatar">EA</Link>

          {/* burger button, only visible on mobile */}
          <button id="open__nav-btn">☰</button>
        </div>

      </div>
    </nav>
  )
}
