import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/css/overview-stats.css';

export default function OverviewStatsCard({ targetUserId }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    likesCount: 0,
    likesChange: null,
    followersCount: 0,
    followersChange: null,
    savesCount: 0,
    savesChange: null,
  });

  useEffect(() => {
    if (!targetUserId) return;

    let isMounted = true;

    const fetchMonthlyMetrics = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

        // 1. Check account creation date
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', targetUserId)
          .maybeSingle();

        const isAccountOlderThanMonth = userProfile?.created_at
          ? (now.getTime() - new Date(userProfile.created_at).getTime()) >= 30 * 24 * 60 * 60 * 1000
          : false;

        // 2. Get all published post IDs for this author
        const { data: authorPosts } = await supabase
          .from('posts')
          .select('id')
          .eq('author_id', targetUserId);

        const postIds = (authorPosts || []).map((p) => p.id);

        // 3. Query Followers: last 30 days vs previous 30 days
        const { data: recentFollows } = await supabase
          .from('follows')
          .select('created_at')
          .eq('following_id', targetUserId)
          .gte('created_at', thirtyDaysAgo);

        const { data: prevFollows } = await supabase
          .from('follows')
          .select('created_at')
          .eq('following_id', targetUserId)
          .gte('created_at', sixtyDaysAgo)
          .lt('created_at', thirtyDaysAgo);

        const { count: totalFollowers } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', targetUserId);

        const curFollowersCount = recentFollows?.length ?? 0;
        const prevFollowersCount = prevFollows?.length ?? 0;
        const followersDisplay = curFollowersCount > 0 ? curFollowersCount : (totalFollowers || 0);

        // 4. Query Likes on author's posts: last 30 days vs previous 30 days
        let curLikesCount = 0;
        let prevLikesCount = 0;
        let totalLikesCount = 0;

        if (postIds.length > 0) {
          const { data: recentLikes } = await supabase
            .from('likes')
            .select('id, created_at')
            .in('post_id', postIds)
            .gte('created_at', thirtyDaysAgo);

          const { data: prevLikes } = await supabase
            .from('likes')
            .select('id, created_at')
            .in('post_id', postIds)
            .gte('created_at', sixtyDaysAgo)
            .lt('created_at', thirtyDaysAgo);

          const { count: totalLikes } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .in('post_id', postIds);

          curLikesCount = recentLikes?.length ?? 0;
          prevLikesCount = prevLikes?.length ?? 0;
          totalLikesCount = totalLikes || 0;
        }

        const likesDisplay = curLikesCount > 0 ? curLikesCount : totalLikesCount;

        // 5. Query Saves on author's posts: last 30 days vs previous 30 days
        let curSavesCount = 0;
        let prevSavesCount = 0;
        let totalSavesCount = 0;

        if (postIds.length > 0) {
          const { data: recentSaves } = await supabase
            .from('saved_posts')
            .select('id, created_at')
            .in('post_id', postIds)
            .gte('created_at', thirtyDaysAgo);

          const { data: prevSaves } = await supabase
            .from('saved_posts')
            .select('id, created_at')
            .in('post_id', postIds)
            .gte('created_at', sixtyDaysAgo)
            .lt('created_at', thirtyDaysAgo);

          const { count: totalSaves } = await supabase
            .from('saved_posts')
            .select('*', { count: 'exact', head: true })
            .in('post_id', postIds);

          curSavesCount = recentSaves?.length ?? 0;
          prevSavesCount = prevSaves?.length ?? 0;
          totalSavesCount = totalSaves || 0;
        }

        const savesDisplay = curSavesCount > 0 ? curSavesCount : totalSavesCount;

        // Percentage calculations: only show when there is a completed prior month to compare against
        const calculateTrend = (current, previous) => {
          // If the account hasn't completed at least 30 days or had 0 in the previous month,
          // month-over-month trend comparison is omitted
          if (!isAccountOlderThanMonth || previous === 0) {
            return null;
          }
          const pct = Math.round(((current - previous) / previous) * 100);
          if (pct === 0) return null;
          if (pct > 0) return { text: `+${pct}%`, isPositive: true };
          return { text: `${pct}%`, isPositive: false };
        };

        if (isMounted) {
          setStats({
            likesCount: likesDisplay,
            likesChange: calculateTrend(curLikesCount, prevLikesCount),
            followersCount: followersDisplay,
            followersChange: calculateTrend(curFollowersCount, prevFollowersCount),
            savesCount: savesDisplay,
            savesChange: calculateTrend(curSavesCount, prevSavesCount),
          });
        }
      } catch (err) {
        console.error('Error fetching overview metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMonthlyMetrics();

    return () => {
      isMounted = false;
    };
  }, [targetUserId]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    if (num >= 10000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return Number(num).toLocaleString('en-US');
  };

  return (
    <div className="overview-stats-card">
      <div className="overview-stats-header">
        <h3 className="overview-stats-title">Overview</h3>
        <span className="overview-stats-subtitle">Last 30 days</span>
      </div>

      <div className="overview-stats-list">
        {/* Row 1: Likes */}
        <div className="overview-stat-row">
          <span className="overview-stat-label">Story Likes</span>
          <div className="overview-stat-value-group">
            {stats.likesChange && (
              <span
                className={`overview-trend-pill ${
                  stats.likesChange.isPositive ? 'overview-trend-pill--pos' : 'overview-trend-pill--neg'
                }`}
              >
                {stats.likesChange.text}
              </span>
            )}
            <strong className="overview-stat-value">
              {loading ? '—' : formatNumber(stats.likesCount)}
            </strong>
          </div>
        </div>

        {/* Row 2: New Followers */}
        <div className="overview-stat-row">
          <span className="overview-stat-label">New Followers</span>
          <div className="overview-stat-value-group">
            {stats.followersChange && (
              <span
                className={`overview-trend-pill ${
                  stats.followersChange.isPositive ? 'overview-trend-pill--pos' : 'overview-trend-pill--neg'
                }`}
              >
                {stats.followersChange.text}
              </span>
            )}
            <strong className="overview-stat-value">
              {loading ? '—' : formatNumber(stats.followersCount)}
            </strong>
          </div>
        </div>

        {/* Row 3: Saved Stories */}
        <div className="overview-stat-row">
          <span className="overview-stat-label">Story Saves</span>
          <div className="overview-stat-value-group">
            {stats.savesChange && (
              <span
                className={`overview-trend-pill ${
                  stats.savesChange.isPositive ? 'overview-trend-pill--pos' : 'overview-trend-pill--neg'
                }`}
              >
                {stats.savesChange.text}
              </span>
            )}
            <strong className="overview-stat-value">
              {loading ? '—' : formatNumber(stats.savesCount)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
