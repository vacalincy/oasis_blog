import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

// Fallback demo notifications for guest preview or before DB table is created
const DEMO_NOTIFICATIONS = [
  {
    id: 'demo-1',
    type: 'like',
    is_read: false,
    actor: {
      id: 'demo-user-1',
      username: 'Sarah Jenkins',
      avatar_url: '/assets/images/avatars/JaneDoe.jpg'
    },
    post: {
      id: 'demo-post-1',
      title: 'The Evolution of Swiss Typography'
    },
    content: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: '/post'
  },
  {
    id: 'demo-2',
    type: 'comment',
    is_read: false,
    actor: {
      id: 'demo-user-2',
      username: 'Alex Chen',
      avatar_url: '/assets/images/avatars/elena.jpg'
    },
    post: {
      id: 'demo-post-1',
      title: 'The Evolution of Swiss Typography'
    },
    content: 'This completely changed how I approach my grid layouts. Thank you!',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    link: '/post'
  },
  {
    id: 'demo-3',
    type: 'follower',
    is_read: true,
    actor: {
      id: 'demo-user-3',
      username: 'Marcus Wright',
      avatar_url: '/assets/images/avatars/marcus.jpg'
    },
    post: null,
    content: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    link: null
  },
  {
    id: 'demo-4',
    type: 'system',
    is_read: true,
    actor: null,
    post: {
      id: 'demo-post-2',
      title: 'Mastering CSS Grid'
    },
    content: 'Your post Mastering CSS Grid was published successfully.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: '/post'
  }
];

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  // Helper to calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      // Use local storage / demo fallback for guests
      const saved = localStorage.getItem('oasis_guest_notifications');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch {
          setNotifications(DEMO_NOTIFICATIONS);
        }
      } else {
        setNotifications(DEMO_NOTIFICATIONS);
      }
      return;
    }

    setLoading(true);
    try {
      let loadedData = null;
      // 1. Try relational query
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          content,
          is_read,
          created_at,
          post_id,
          actor_id,
          actor:profiles(id, username, avatar_url),
          post:posts(id, title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        loadedData = data;
      } else {
        // Fallback: simple select without joins, in case relationship alias or cache differs
        const { data: rawData, error: rawError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!rawError && rawData) {
          // Enrich with profiles and posts manually
          const actorIds = [...new Set(rawData.map(n => n.actor_id).filter(Boolean))];
          const postIds = [...new Set(rawData.map(n => n.post_id).filter(Boolean))];

          const profilesMap = {};
          if (actorIds.length > 0) {
            const { data: profs } = await supabase.from('profiles').select('id, username, avatar_url').in('id', actorIds);
            if (profs) profs.forEach(p => { profilesMap[p.id] = p; });
          }

          const postsMap = {};
          if (postIds.length > 0) {
            const { data: psts } = await supabase.from('posts').select('id, title').in('id', postIds);
            if (psts) psts.forEach(p => { postsMap[p.id] = p; });
          }

          loadedData = rawData.map(n => ({
            ...n,
            actor: profilesMap[n.actor_id] || null,
            post: postsMap[n.post_id] || null
          }));
        }
      }

      if (loadedData) {
        setNotifications(loadedData);
      } else {
        // Fallback to local storage or demo
        const saved = localStorage.getItem(`oasis_notifications_${user.id}`);
        if (saved) {
          try {
            setNotifications(JSON.parse(saved));
          } catch {
            setNotifications(DEMO_NOTIFICATIONS);
          }
        }
      }

      // Also fetch which actors current user is following
      const { data: followsData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followsData) {
        const map = {};
        followsData.forEach(f => {
          map[f.following_id] = true;
        });
        setFollowingMap(map);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load on user change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Refresh when switching back to tab (e.g. testing with 2 accounts in different windows)
  useEffect(() => {
    const handleFocus = () => {
      if (user) fetchNotifications();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchNotifications]);

  // Realtime subscription when logged in
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // Mark a single notification as read
  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );

    if (user) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not mark notification as read in DB:', err);
      }
    } else {
      const updated = notifications.map(n => (n.id === id ? { ...n, is_read: true } : n));
      localStorage.setItem('oasis_guest_notifications', JSON.stringify(updated));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    if (user) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
      } catch (err) {
        console.warn('Could not mark all as read in DB:', err);
      }
    } else {
      const updated = notifications.map(n => ({ ...n, is_read: true }));
      localStorage.setItem('oasis_guest_notifications', JSON.stringify(updated));
    }
  };

  // Create a new notification (used on like, comment, follow, system actions)
  const createNotification = async ({ userId, actorId, type, postId, content }) => {
    // Avoid sending notification to self
    if (actorId && userId && actorId === userId) return;
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          actor_id: actorId || null,
          type,
          post_id: postId || null,
          content: content || null,
          is_read: false
        });

      if (error) {
        console.warn('Failed to insert notification into DB:', error.message);
      }
    } catch (err) {
      console.warn('Error in createNotification:', err);
    }
  };

  // Toggle follow user from a notification card
  const toggleFollowActor = async (actorId) => {
    if (!actorId) return;
    const isCurrentlyFollowing = !!followingMap[actorId];
    const newFollowingState = !isCurrentlyFollowing;

    // Optimistic update
    setFollowingMap(prev => ({ ...prev, [actorId]: newFollowingState }));

    if (!user) return;

    try {
      if (newFollowingState) {
        await supabase.from('follows').insert({ follower_id: user.id, following_id: actorId });
        // Send notification to the followed user
        await createNotification({
          userId: actorId,
          actorId: user.id,
          type: 'follower'
        });
      } else {
        await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', actorId);
      }
    } catch (err) {
      console.warn('Follow toggle failed:', err);
      // Revert optimistic update
      setFollowingMap(prev => ({ ...prev, [actorId]: isCurrentlyFollowing }));
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        followingMap,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        createNotification,
        toggleFollowActor
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
