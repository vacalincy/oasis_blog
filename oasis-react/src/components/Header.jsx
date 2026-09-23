export default function Header() {
  return (
    <nav>
      <div className="container nav__container">
        
        {/* 1. Logo */}
        <a href="/discover" className="nav__logo">
          <img src="/assets/images/brand/logo.svg" alt="OASIS Logo" />
        </a>

        {/* 2. Center menu (desktop) / sliding panel (mobile) */}
        <ul className="nav__items">
          <li><button id="close__nav-btn">✕</button></li>
          <li><a href="/discover" className="active">Discover</a></li>
          <li><a href="/following">Following</a></li>
          <li><a href="/popular">Popular</a></li>
          <li><a href="/topics">Topics</a></li>
          <li><a href="/about">About</a></li>
        </ul>

        {/* 3. Right side: search, notifications, avatar, burger */}
        <div className="nav__actions">
          <form action="/search" method="GET" className="search-bar">
            <img loading="lazy" src="/assets/images/icons/search.svg" alt="Search" />
            <input type="text" placeholder="Search stories..." aria-label="Search stories" />
          </form>

          <a href="/notifications" className="notification-btn" aria-label="Notifications">
            <img loading="lazy" src="/assets/images/icons/notification_icon.svg" alt="Notifications" />
          </a>

          <a href="/dashboard" className="avatar">EA</a>

          {/* burger button, only visible on mobile */}
          <button id="open__nav-btn">☰</button>
        </div>

      </div>
    </nav>
  )
}
