import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  // Helper to calculate unread count respecting user preferences
  const unreadCount = notifications.filter(n => {
    if (n.is_read) return false;
    try {
      const prefLikes = localStorage.getItem('oasis_pref_likes') !== 'false';
      const prefComments = localStorage.getItem('oasis_pref_comments') !== 'false';
      const prefFollowers = localStorage.getItem('oasis_pref_followers') !== 'false';
      const prefAlerts = localStorage.getItem('oasis_pref_email_alerts') !== 'false';

      if (!prefLikes && n.type === 'like') return false;
      if (!prefComments && (n.type === 'comment' || n.type === 'mention')) return false;
      if (!prefFollowers && n.type === 'follower') return false;
      if (!prefAlerts && n.type === 'system') return false;
    } catch {
      // Ignore localStorage read errors
    }
    return true;
  }).length;

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      // Use local storage for guests
      const saved = localStorage.getItem('oasis_guest_notifications');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
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
        try {
          localStorage.setItem(`oasis_notifications_${user.id}`, JSON.stringify(loadedData));
        } catch {
          // Ignore localStorage write errors
        }
      } else {
        // Fallback to local storage
        const saved = localStorage.getItem(`oasis_notifications_${user.id}`);
        if (saved) {
          try {
            setNotifications(JSON.parse(saved));
          } catch {
            setNotifications([]);
          }
        } else {
          setNotifications([]);
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
