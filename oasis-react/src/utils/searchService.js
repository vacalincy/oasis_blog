import { supabase } from '../supabaseClient';
import { CATEGORIES } from '../constants/categories';

/**
 * Searches published posts, authors, and topics matching query
 * @param {string} query
 * @param {object} options
 * @returns {Promise<{ posts: Array, authors: Array, topics: Array }>}
 */
export async function searchContent(query, options = {}) {
  const { limitPosts = 6, limitAuthors = 4 } = options;
  const clean = (query || '').trim().toLowerCase();

  if (!clean || clean.length < 2) {
    return { posts: [], authors: [], topics: [] };
  }

  // 1. Search matching topics from CATEGORIES
  const matchedTopics = CATEGORIES.filter(cat => {
    const nameMatch = cat.name.toLowerCase().includes(clean);
    const descMatch = cat.description?.toLowerCase().includes(clean);
    const aliasMatch = cat.aliases?.some(a => a.toLowerCase().includes(clean));
    const subMatch = cat.subcategories?.some(s => s.name.toLowerCase().includes(clean));
    return nameMatch || descMatch || aliasMatch || subMatch;
  }).slice(0, 3);

  // 2. Search Posts & Authors in parallel
  try {
    const [postsRes, authorsRes] = await Promise.all([
      supabase
        .from('posts')
        .select('id, title, subtitle, cover_image, category, created_at, author_id, profiles(username, avatar_url)')
        .eq('status', 'published')
        .or(`title.ilike.%${clean}%,subtitle.ilike.%${clean}%,category.ilike.%${clean}%`)
        .order('created_at', { ascending: false })
        .limit(limitPosts),
      supabase
        .from('profiles')
        .select('id, username, avatar_url, bio')
        .or(`username.ilike.%${clean}%,bio.ilike.%${clean}%`)
        .limit(limitAuthors)
    ]);

    return {
      posts: postsRes.data || [],
      authors: authorsRes.data || [],
      topics: matchedTopics
    };
  } catch (err) {
    console.error('Search error:', err);
    return {
      posts: [],
      authors: [],
      topics: matchedTopics
    };
  }
}
