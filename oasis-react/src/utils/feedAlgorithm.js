/**
 * OASIS Smart Feed Ranking & Personalization Engine
 * 
 * Inspired by hybrid ranking architectures (Hacker News / Reddit time-decay + Pinterest engagement graph).
 * Computes content momentum, author affinity, and ensures feed diversification.
 */

/**
 * Computes engagement score from community interactions.
 * Bookmarks/saves carry highest weight (4x), discussions/comments (3x), likes (2x).
 */
export function calculateEngagement(likes = 0, comments = 0, saves = 0) {
  return (likes * 2) + (comments * 3) + (saves * 4);
}

/**
 * Computes time-decay score for a post.
 * Fresh posts get a baseline visibility boost; quality posts sustain momentum for 24-48h.
 */
export function calculateDecayScore(engagement, createdAt, now = Date.now()) {
  const postTime = new Date(createdAt).getTime();
  const hoursOld = Math.max(0, (now - postTime) / 3600000);
  const decayFactor = Math.pow(hoursOld + 2, 1.35);
  return (engagement + 1.2) / decayFactor;
}

/**
 * Analyzes current user's interaction history to extract preferred categories.
 */
export function extractUserAffinity(userLikedPostIds = new Set(), userSavedPostIds = new Set(), allPosts = []) {
  const categoryCounts = {};
  
  allPosts.forEach(post => {
    if (!post.category) return;
    const cat = post.category.split(' - ')[0].trim().toLowerCase();
    
    if (userSavedPostIds.has(post.id)) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 3;
    }
    if (userLikedPostIds.has(post.id)) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 2;
    }
  });

  // Keep categories with positive user affinity
  const preferred = new Set();
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count >= 2) preferred.add(cat);
  });
  
  return preferred;
}

/**
 * Interleaves posts so consecutive items do not share the same author.
 * Emulates high-end editorial and Pinterest layout diversity.
 */
export function diversifyByAuthor(posts) {
  if (posts.length <= 2) return posts;

  const result = [];
  const queue = [...posts];

  while (queue.length > 0) {
    const lastAuthorId = result.length > 0 ? result[result.length - 1].author_id : null;
    
    // Find first post in queue with a different author
    const nextIdx = queue.findIndex(p => p.author_id && p.author_id !== lastAuthorId);
    
    if (nextIdx !== -1) {
      result.push(queue.splice(nextIdx, 1)[0]);
    } else {
      // If only the same author remains, append sequentially
      result.push(queue.shift());
    }
  }

  return result;
}

/**
 * Ranks a list of posts according to the selected mode and user affinity.
 * 
 * @param {Array} posts - Array of post objects with metadata
 * @param {Object} options
 * @param {string} options.mode - 'for-you' | 'latest' | 'top'
 * @param {Set} options.followedAuthorIds - Authors followed by the active user
 * @param {Set} options.preferredCategories - Topics frequently engaged with by the user
 * @returns {Array} Ordered and diversified posts
 */
export function rankPosts(posts, {
  mode = 'for-you',
  followedAuthorIds = new Set(),
  preferredCategories = new Set(),
  now = Date.now()
} = {}) {
  if (!posts || posts.length === 0) return [];

  // Compute scoring attributes for all posts
  const scoredPosts = posts.map(post => {
    const likes = post.likes_count || 0;
    const comments = post.comments_count || 0;
    const saves = post.saves_count || 0;
    const engagement = calculateEngagement(likes, comments, saves);
    const decayScore = calculateDecayScore(engagement, post.created_at, now);

    let multiplier = 1.0;
    const authorId = post.author_id;
    const mainCat = (post.category?.split(' - ')[0] || '').trim().toLowerCase();

    if (followedAuthorIds.has(authorId)) {
      multiplier *= 1.4; // 40% affinity boost for followed creators
    }
    if (preferredCategories.has(mainCat)) {
      multiplier *= 1.3; // 30% affinity boost for preferred topics
    }

    const smartScore = decayScore * multiplier;

    return {
      ...post,
      _engagement: engagement,
      _smartScore: smartScore,
    };
  });

  if (mode === 'latest') {
    return [...scoredPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (mode === 'top') {
    return [...scoredPosts].sort((a, b) => {
      if (b._engagement !== a._engagement) return b._engagement - a._engagement;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }

  // 'for-you' mode: smart score + author diversification
  const sorted = [...scoredPosts].sort((a, b) => {
    if (Math.abs(b._smartScore - a._smartScore) > 0.001) {
      return b._smartScore - a._smartScore;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return diversifyByAuthor(sorted);
}
