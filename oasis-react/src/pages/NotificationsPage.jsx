import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import '../assets/css/notifications.css';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    notifications,
    unreadCount,
    loading,
    followingMap,
    markAsRead,
    markAllAsRead,
    toggleFollowActor
  } = useNotifications();

  // Helper to filter notifications by user preferences
  const isTypeAllowed = (type) => {
    try {
      const prefLikes = localStorage.getItem('oasis_pref_likes') !== 'false';
      const prefComments = localStorage.getItem('oasis_pref_comments') !== 'false';
      const prefFollowers = localStorage.getItem('oasis_pref_followers') !== 'false';
      const prefAlerts = localStorage.getItem('oasis_pref_email_alerts') !== 'false';

      if (!prefLikes && type === 'like') return false;
      if (!prefComments && (type === 'comment' || type === 'mention')) return false;
      if (!prefFollowers && type === 'follower') return false;
      if (!prefAlerts && type === 'system') return false;
    } catch {
      // Ignore localStorage read errors
    }
    return true;
  };

  const allowedNotifications = notifications.filter(n => isTypeAllowed(n.type));

  // Dynamic unread counters (reset to 0 once notifications are read)
  const countAll = allowedNotifications.filter(n => !n.is_read).length;
  const countMentions = allowedNotifications.filter(
    n => !n.is_read && (n.type === 'like' || n.type === 'comment' || n.type === 'mention')
  ).length;
  const countFollowers = allowedNotifications.filter(n => !n.is_read && n.type === 'follower').length;
  const countSystem = allowedNotifications.filter(n => !n.is_read && n.type === 'system').length;

  const handleMarkAllRead = () => {
    markAllAsRead();
    addToast('All notifications marked as read', 'success');
  };

  const filteredNotifications = allowedNotifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'mention') return n.type === 'like' || n.type === 'comment' || n.type === 'mention';
    return n.type === filter;
  });

  const formatTime = (timeInput) => {
    if (!timeInput) return '';
    // If it's already a relative string (like in mock), return it
    if (typeof timeInput === 'string' && (timeInput.includes('ago') || timeInput.includes('Just now'))) {
      return timeInput;
    }
    const date = new Date(timeInput);
    const diffMs = Date.now() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }

    // Determine target link
    const targetPostId = notif.post_id || notif.post?.id;
    const targetActorId = notif.actor_id || notif.actor?.id;

    if (notif.type === 'follower' && targetActorId) {
      navigate(`/profile/${targetActorId}`);
    } else if (targetPostId) {
      navigate(`/post/${targetPostId}`);
    } else if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="notifications-page">
      <Header />

      <main className="notifications-container">
        <div className="notifications-header">
          <h1>Your notifications</h1>
          <button
            className={`btn-mark-read ${unreadCount === 0 ? 'disabled' : ''}`}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            title={unreadCount === 0 ? 'All caught up' : 'Mark all notifications as read'}
          >
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
            View all <span className="badge">{countAll}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'mention' ? 'active' : ''}`}
            onClick={() => setFilter('mention')}
          >
            Mentions <span className="badge">{countMentions}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'follower' ? 'active' : ''}`}
            onClick={() => setFilter('follower')}
          >
            Followers <span className="badge">{countFollowers}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'system' ? 'active' : ''}`}
            onClick={() => setFilter('system')}
          >
            System <span className="badge">{countSystem}</span>
          </button>
        </div>

        <div className="notifications-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="notifications-empty__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3>No notifications yet</h3>
              <p>
                {filter === 'all'
                  ? 'When someone likes your stories, comments, or follows you, you will see it here.'
                  : `You don't have any ${filter === 'mention' ? 'mentions or likes' : filter} notifications right now.`}
              </p>
              <Link to="/discover" className="btn-explore">Explore stories</Link>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const isUnread = !notif.is_read;
              const actor = notif.actor || {};
              const post = notif.post || {};
              const actorId = notif.actor_id || actor.id;
              const isFollowingActor = !!followingMap[actorId];

              // Pick icon based on notification type
              let notifIcon = '/assets/images/icons/not_checked.png';
              let iconAlt = 'System';
              let isSystemAvatar = false;
              let avatarSrc = actor.avatar_url || '/assets/images/avatars/JaneDoe.jpg';

              if (notif.type === 'like') {
                notifIcon = '/assets/images/icons/not_heart.png';
                iconAlt = 'Like';
                avatarSrc = actor.avatar_url || '/assets/images/avatars/JaneDoe.jpg';
              } else if (notif.type === 'comment' || notif.type === 'mention') {
                notifIcon = '/assets/images/icons/not_comment.png';
                iconAlt = 'Comment';
                avatarSrc = actor.avatar_url || '/assets/images/avatars/elena.jpg';
              } else if (notif.type === 'follower') {
                notifIcon = '/assets/images/icons/not_people.png';
                iconAlt = 'Follower';
                avatarSrc = actor.avatar_url || '/assets/images/avatars/marcus.jpg';
              } else if (notif.type === 'system') {
                notifIcon = '/assets/images/icons/not_checked.png';
                iconAlt = 'System';
                avatarSrc = '/assets/images/brand/favicon2.svg';
                isSystemAvatar = true;
              }

              return (
                <div
                  key={notif.id}
                  className={`notification-item ${isUnread ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notif)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNotificationClick(notif);
                    }
                  }}
                >
                  <div className={`notif-avatar ${isSystemAvatar ? 'system' : ''}`}>
                    <img 
                      decoding="async" 
                      src={avatarSrc} 
                      alt={actor.username || 'Avatar'} 
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                    />
                    <img decoding="async" className="notif-icon" src={notifIcon} alt={iconAlt} />
                  </div>

                  <div className="notif-content">
                    {notif.type === 'like' && (
                      <p>
                        <strong>{actor.username || 'A reader'}</strong> liked your post{' '}
                        {post.title ? <em>{post.title}</em> : <em>The Evolution of Swiss Typography</em>}
                      </p>
                    )}
                    {(notif.type === 'comment' || notif.type === 'mention') && (
                      <p>
                        <strong>{actor.username || 'A reader'}</strong> commented:{' '}
                        "{notif.content || 'This completely changed how I approach my layouts. Thank you!'}"
                      </p>
                    )}
                    {notif.type === 'follower' && (
                      <p>
                        <strong>{actor.username || 'A creator'}</strong> started following you.
                      </p>
                    )}
                    {notif.type === 'system' && (
                      <p>
                        {notif.content ? notif.content : (
                          <>Your post {post.title ? <em>{post.title}</em> : <em>Mastering CSS Grid</em>} was published successfully.</>
                        )}
                      </p>
                    )}
                    <span className="notif-time">{formatTime(notif.created_at || notif.time)}</span>
                  </div>

                  {notif.type === 'follower' && (
                    <div className="notif-action" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-follow-back"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFollowActor(actorId);
                        }}
                        style={isFollowingActor ? {
                          background: 'var(--color-bg-light, #f1f5f9)',
                          color: 'var(--color-text-main, #19326F)',
                          border: '1px solid var(--color-border, #e2e8f0)'
                        } : {}}
                      >
                        {isFollowingActor ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
