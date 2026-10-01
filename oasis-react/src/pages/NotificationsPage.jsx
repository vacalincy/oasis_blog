import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/notifications.css'; // Direct import

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      unread: true,
      avatar: '/assets/images/content/002.jpg',
      icon: '/assets/images/icons/not_heart.png',
      iconAlt: 'Like',
      content: <><p><strong>Sarah Jenkins</strong> liked your post <em>The Evolution of Swiss Typography</em></p></>,
      time: '2 hours ago',
      link: '/post'
    },
    {
      id: 2,
      type: 'mention',
      unread: true,
      avatar: '/assets/images/content/003.jpg',
      icon: '/assets/images/icons/not_comment.png',
      iconAlt: 'Comment',
      content: <><p><strong>Alex Chen</strong> commented: "This completely changed how I approach my grid layouts. Thank you!"</p></>,
      time: '5 hours ago',
      link: '/post'
    },
    {
      id: 3,
      type: 'follower',
      unread: false,
      avatar: '/assets/images/content/004.jpg',
      icon: '/assets/images/icons/not_people.png',
      iconAlt: 'Follower',
      content: <><p><strong>Marcus Wright</strong> started following you.</p></>,
      time: '1 day ago',
      hasAction: true,
      link: null
    },
    {
      id: 4,
      type: 'system',
      unread: false,
      avatar: '/assets/images/brand/favicon2.svg',
      icon: '/assets/images/icons/not_checked.png',
      iconAlt: 'System',
      content: <><p>Your post <em>Mastering CSS Grid</em> was published successfully.</p></>,
      time: '3 days ago',
      link: '/post',
      isSystemAvatar: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'mention' && (n.type === 'like' || n.type === 'mention')) return true;
    return n.type === filter;
  });

  return (
    <div className="notifications-page">
      <Header />
      
      <main className="notifications-container">
        <div className="notifications-header">
            <h1>Your notifications</h1>
            <button className="btn-mark-read" onClick={handleMarkAllRead}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 6 7 17 2 12"></polyline>
                    <polyline points="22 6 11 17 9 15"></polyline>
                </svg>
                Mark all as read
            </button>
        </div>

        <div className="notifications-filters">
            <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`} 
                onClick={() => setFilter('all')}
            >
                View all <span className="badge">12</span>
            </button>
            <button 
                className={`filter-tab ${filter === 'mention' ? 'active' : ''}`} 
                onClick={() => setFilter('mention')}
            >
                Mentions <span className="badge">6</span>
            </button>
            <button 
                className={`filter-tab ${filter === 'follower' ? 'active' : ''}`} 
                onClick={() => setFilter('follower')}
            >
                Followers <span className="badge">4</span>
            </button>
            <button 
                className={`filter-tab ${filter === 'system' ? 'active' : ''}`} 
                onClick={() => setFilter('system')}
            >
                System <span className="badge">2</span>
            </button>
        </div>

        <div className="notifications-list">
            {filteredNotifications.map(notif => {
                const ItemTag = notif.link ? Link : 'div';
                const itemProps = notif.link ? { to: notif.link } : {};
                
                return (
                    <ItemTag 
                        key={notif.id} 
                        className={`notification-item ${notif.unread ? 'unread' : ''}`} 
                        {...itemProps}
                    >
                        <div className={`notif-avatar ${notif.isSystemAvatar ? 'system' : ''}`}>
                            <img loading="lazy" src={notif.avatar} alt="Avatar" />
                            <img loading="lazy" className="notif-icon" src={notif.icon} alt={notif.iconAlt} />
                        </div>
                        <div className="notif-content">
                            {notif.content}
                            <span className="notif-time">{notif.time}</span>
                        </div>
                        {notif.hasAction && (
                            <div className="notif-action">
                                <button 
                                    className="btn-follow-back" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsFollowing(!isFollowing);
                                    }}
                                    style={isFollowing ? {
                                        background: 'var(--color-bg-light)',
                                        color: 'var(--color-text-main)',
                                        border: '1px solid var(--color-border)'
                                    } : {}}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        )}
                    </ItemTag>
                );
            })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
