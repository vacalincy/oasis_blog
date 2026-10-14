import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TabBar() {
  const location = useLocation();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { path: '/discover', icon: '/assets/images/icons/tabbar_home.png', alt: 'Home' },
    { path: '/search', icon: '/assets/images/icons/tabbar_search.png', alt: 'Search' },
    { path: '/add-post', icon: '/assets/images/icons/tabbar_add.png', alt: 'Add post' },
    { path: '/dashboard', icon: '/assets/images/icons/tabbar_profile.png', alt: 'Profile' }
  ];

  useEffect(() => {
    // Determine active index based on current path
    const currentIndex = navItems.findIndex(item => location.pathname.startsWith(item.path));
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    } else {
      if (location.pathname === '/') {
        setActiveIndex(-1); 
      }
    }
  }, [location.pathname]);

  if (location.pathname === '/' || !user) {
    return null;
  }

  return (
    <div className="tab-bar-wrapper">
      <div className="tab-bar-base">
        {navItems.map((item, index) => (
          <Link key={index} to={item.path} className={`nav-item ${activeIndex === index ? 'active' : ''}`}>
            <img src={item.icon} alt={item.alt} />
          </Link>
        ))}
      </div>
      <div className={`tab-bar-highlight active-${activeIndex >= 0 ? activeIndex : 0}`}>
        {navItems.map((item, index) => (
          <div key={`highlight-${index}`} className="nav-item">
            <img src={item.icon} alt={item.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}
