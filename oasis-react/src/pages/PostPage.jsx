import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import PostCard from '../components/PostCard';
import CommentItem from '../components/CommentItem';

export default function PostPage() {
  const { id } = useParams();
  const addToast = useToast();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, profile } = useAuth();
  const { createNotification } = useNotifications();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
      const fetchEngagement = async () => {
          if (!id) return;
          
          // Get total likes
          const { count, error: countError } = await supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', id);
              
          if (!countError) setLikesCount(count || 0);

          if (user) {
              const { data: likeData } = await supabase
                  .from('likes')
                  .select('id')
                  .eq('post_id', id)
                  .eq('user_id', user.id)
                  .maybeSingle();
                  
              setIsLiked(!!likeData);
              
              const { data: saveData } = await supabase
                  .from('saved_posts')
                  .select('id')
                  .eq('post_id', id)
                  .eq('user_id', user.id)
                  .maybeSingle();
                  
              setIsSaved(!!saveData);
          }
          
          // Fetch Comments
          const { data: commentsData } = await supabase
              .from('comments')
              .select('*, profiles(username, avatar_url)')
              .eq('post_id', id)
              .is('parent_id', null)
              .order('created_at', { ascending: false });
              
          if (commentsData) setComments(commentsData);
      };
      
      fetchEngagement();
  }, [id, user]);

  const handleLike = async () => {
      if (!user) {
          addToast("Please login to like posts", "info");
          return;
      }
      const previousLiked = isLiked;
      const previousCount = likesCount;
      setIsLiked(!previousLiked);
      setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);
      
      if (!previousLiked) {
          await supabase.from('likes').insert({ post_id: id, user_id: user.id });
          let targetAuthorId = post?.author_id;
          if (!targetAuthorId) {
              const { data: pData } = await supabase.from('posts').select('author_id').eq('id', id).maybeSingle();
              targetAuthorId = pData?.author_id;
          }
          if (targetAuthorId && targetAuthorId !== user.id) {
              createNotification({
                  userId: targetAuthorId,
                  actorId: user.id,
                  type: 'like',
                  postId: id
              });
          }
      } else {
          await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id);
      }
  };

  const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (!user) {
          addToast("Please login to comment", "info");
          return;
      }
      if (!newComment.trim()) return;
      
      setIsSubmittingComment(true);
      const { data, error } = await supabase
          .from('comments')
          .insert({ post_id: id, user_id: user.id, text: newComment.trim() })
          .select('*, profiles(username, avatar_url)')
          .single();
          
      setIsSubmittingComment(false);
      
      if (error) {
          addToast("Error: " + error.message, "error");
      } else if (data) {
          setComments([data, ...comments]);
          setNewComment("");
          addToast("Comment posted!", "success");
          
          let targetAuthorId = post?.author_id;
          if (!targetAuthorId) {
              const { data: pData } = await supabase.from('posts').select('author_id').eq('id', id).maybeSingle();
              targetAuthorId = pData?.author_id;
          }
          if (targetAuthorId && targetAuthorId !== user.id) {
              createNotification({
                  userId: targetAuthorId,
                  actorId: user.id,
                  type: 'comment',
                  postId: id,
                  content: newComment.trim()
              });
          }
      }
  };

  const handleSave = async () => {
      if (!user) {
          addToast("Please login to save posts", "info");
          return;
      }
      const previousSaved = isSaved;
      setIsSaved(!previousSaved);
      
      if (!previousSaved) {
          await supabase.from('saved_posts').insert({ post_id: id, user_id: user.id });
          addToast("Story saved to Dashboard", "success");
      } else {
          await supabase.from('saved_posts').delete().eq('post_id', id).eq('user_id', user.id);
      }
  };

  const handleShare = async () => {
      const url = window.location.href;
      if (navigator.share && navigator.canShare && navigator.canShare({ url })) {
          try {
              await navigator.share({
                  title: post?.title || 'OASIS Story',
                  text: post?.subtitle || 'Read this story on OASIS',
                  url
              });
              return;
          } catch (err) {
              if (err.name !== 'AbortError') {
                  console.warn('Share error:', err);
              }
          }
      }
      try {
          await navigator.clipboard.writeText(url);
          addToast('Story link copied to clipboard!', 'success');
      } catch {
          addToast('Failed to copy link', 'error');
      }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
        setLoading(true);
        if (!id) return;

        let postData = null;
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, profiles(username, avatar_url)')
                .eq('id', id)
                .maybeSingle();
                
            if (error || !data) {
                // Fallback to plain query in case profiles join is constrained
                const { data: rawPost, error: rawError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                if (rawPost) {
                    if (rawPost.author_id) {
                        const { data: authorProf } = await supabase
                            .from('profiles')
                            .select('username, avatar_url')
                            .eq('id', rawPost.author_id)
                            .maybeSingle();
                        rawPost.profiles = authorProf || null;
                    }
                    postData = rawPost;
                } else if (rawError) {
                    addToast('Error loading post: ' + rawError.message, 'error');
                }
            } else {
                postData = data;
            }
        } catch (err) {
            console.warn('Error fetching post:', err);
        }

        if (postData) {
            setPost(postData);
            
            // Fetch related posts (same category)
            try {
                let { data: relatedData } = await supabase
                    .from('posts')
                    .select('*, profiles(username, avatar_url)')
                    .eq('status', 'published')
                    .eq('category', postData.category)
                    .neq('id', postData.id)
                    .order('created_at', { ascending: false })
                    .limit(3);
                    
                if (!relatedData || relatedData.length < 3) {
                    const { data: fallbackData } = await supabase
                        .from('posts')
                        .select('*, profiles(username, avatar_url)')
                        .eq('status', 'published')
                        .neq('id', postData.id)
                        .order('created_at', { ascending: false })
                        .limit(3);
                    relatedData = fallbackData;
                }
                
                if (relatedData) {
                    setRelatedPosts(relatedData);
                }
            } catch (rErr) {
                console.warn('Related posts issue:', rErr);
            }
        }
        setLoading(false);
    };
    
    fetchPost();
  }, [id]);

  if (loading) {
      return (
          <div className="single-post-page">
              <Header />
              <main style={{ padding: '100px 0', textAlign: 'center' }}>Loading story...</main>
              <Footer />
          </div>
      );
  }

  if (!post) {
      return (
          <div className="single-post-page">
              <Header />
              <main style={{ padding: '100px 0', textAlign: 'center' }}>Story not found.</main>
              <Footer />
          </div>
      );
  }

  return (
    <div className="single-post-page">
      <Header />
      <main style={{ paddingTop: "80px" }}>
      
      
      {/* POST HEADER START                              */}
{/* (topic badge + title + author, centered)       */}
{/* ============================================= */}
<section className="post-header">
    <div className="container post-header__container">

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <Link to={`/category?cat=${encodeURIComponent(post.category?.split(' - ')[0] || '')}`} className="post-header__badge">
                {post.category?.split(' - ')[0] || 'Story'}
            </Link>
            {post.category?.includes(' - ') && post.category.split(' - ')[1]?.split(', ').map(sub => (
                <Link 
                    key={sub}
                    to={`/category?cat=${encodeURIComponent(post.category?.split(' - ')[0] || '')}&sub=${encodeURIComponent(sub.trim())}`}
                    className="post-header__badge"
                    style={{ background: 'var(--color-surface, #f1f5f9)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                >
                    {sub.trim()}
                </Link>
            ))}
        </div>

        <h1 className="post-header__title">{post.title || "Untitled Story"}</h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to={`/profile/${post.author_id}`} className="post-header__author">
                <img 
                    decoding="async" 
                    src={post.profiles?.avatar_url || "/assets/images/icons/avatar.svg"} 
                    alt={post.profiles?.username} 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                />
                <div className="post-header__author-info">
                    <p><b>{post.profiles?.username || 'Unknown Author'}</b></p>
                    <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                </div>
            </Link>

            {user && post.author_id === user.id && (
                <Link 
                    to={`/edit-post/${post.id}`} 
                    className="btn-primary" 
                    style={{ 
                        padding: '8px 18px', 
                        fontSize: '0.85rem', 
                        borderRadius: '100px', 
                        textDecoration: 'none', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        height: 'auto',
                        minHeight: '34px',
                        width: 'auto'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit Story
                </Link>
            )}
        </div>

    </div>
</section>
{/* ============================================= */}
{/* POST HEADER END                                */}
{/* ============================================= */}


{/* ============================================= */}
{/* POST IMAGE START                               */}
{/* (main image + optional caption)                */}
{/* ============================================= */}
<section className="post-media">
    <div className="container post-media__container">
        {post.cover_image && (
            <img src={post.cover_image} alt="Cover" className="post-media__img" style={{ maxHeight: '600px', objectFit: 'cover' }} />
        )}
        {post.subtitle && <p className="post-media__caption">{post.subtitle}</p>}
    </div>
</section>
{/* ============================================= */}
{/* POST IMAGE END                                 */}
{/* ============================================= */}


{/* ============================================= */}
{/* POST BODY START                                */}
{/* (user-formatted content: headings, quotes, p)  */}
{/* ============================================= */}
<section className="post-body">
    <div className="container post-body__container" dangerouslySetInnerHTML={{ __html: post.content }}>
    </div>
</section>
{/* ============================================= */}
{/* POST BODY END                                  */}
{/* ============================================= */}

{/* ============================================= */}
{/* POST ACTIONS START                             */}
{/* (like, comment, save, share)                   */}
{/* ============================================= */}
<section className="post-actions">
    <div className="container post-actions__container">

        <div className="post-actions__group">
            {user ? (
                <label className="post-actions__btn" aria-label="Like">
                    <input type="checkbox" className="post-actions__input post-actions__input--like" checked={isLiked} onChange={handleLike} />
                    <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                    <span>{likesCount}</span>
                </label>
            ) : (
                <span className="post-actions__btn post-actions__btn--readonly" aria-label="Likes">
                    <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px", opacity: 0.6 }}></span>
                    <span>{likesCount}</span>
                </span>
            )}

            <button className="post-actions__btn" aria-label="Comments" onClick={() => setShowCommentsModal(true)}>
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/comment.svg')", width: "20px", height: "20px" }}></span>
                <span>{comments.length}</span>
            </button>
        </div>

        {user && (
            <div className="post-actions__group">
                <label className="post-actions__btn" aria-label="Save">
                    <input type="checkbox" className="post-actions__input post-actions__input--save" checked={isSaved} onChange={handleSave} />
                    <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/bookmark.svg')", width: "16px", height: "16px" }}></span>
                </label>
                
                <button className="post-actions__btn" aria-label="Share" onClick={handleShare}>
                    <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/share.svg')", width: "16px", height: "16px" }}></span>
                </button>
            </div>
        )}

    </div>
</section>
{/* ============================================= */}
{/* POST ACTIONS END                               */}
{/* ============================================= */}


{/* ============================================= */}
{/* COMMENTS SECTION START                         */}
{/* (new comment input + top 2 comments + modal)   */}
{/* ============================================= */}
<section className="comments">
    <div className="container comments__container">

        <div className="comments__header">
            <h2 className="comments__title">Responses ({comments.length})</h2>
            <button className="comments__view-all" onClick={() => setShowCommentsModal(true)}>View all</button>
        </div>

        {user ? (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
                <Link to="/dashboard" className="avatar" style={profile?.avatar_url ? { backgroundImage: `url(${profile.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}>
                    {!profile?.avatar_url && (profile?.username ? profile.username.substring(0,2).toUpperCase() : user.email.substring(0,2).toUpperCase())}
                </Link>
                <textarea 
                    className="comment-form__input" 
                    placeholder="What are your thoughts?" 
                    aria-label="Comment text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmittingComment}
                ></textarea>
                <button type="submit" className="comment-form__submit" disabled={isSubmittingComment || !newComment.trim()}>
                    {isSubmittingComment ? "..." : "Respond"}
                </button>
            </form>
        ) : (
            <div className="comments__guest-box">
                <p className="comments__guest-text">
                    <Link to="/?auth=login" className="comments__guest-link">Log in</Link> or <Link to="/?auth=signup" className="comments__guest-link">Sign up</Link> to join the discussion and leave a comment.
                </p>
            </div>
        )}

        <ul className="comment-list">
            {comments.map(c => (
                <CommentItem 
                    key={c.id} 
                    id={c.id}
                    post_id={id}
                    author_id={c.user_id}
                    author={c.profiles?.username || "Unknown"}
                    avatar={c.profiles?.avatar_url || "/assets/images/icons/avatar.svg"}
                    time={new Date(c.created_at).toLocaleDateString()}
                    isoTime={c.created_at}
                    text={c.text}
                />
            ))}
        </ul>

    </div>
</section>

{showCommentsModal && (
<div className="comments-modal active" id="comments-modal" onClick={(e) => { if (e.target.id === 'comments-modal') setShowCommentsModal(false); }}>
    <div className="comments-modal__content">
        <div className="comments-modal__header">
            <h2>All Responses ({comments.length})</h2>
            <button className="comments-modal__close" aria-label="Close" onClick={() => setShowCommentsModal(false)}>✕</button>
        </div>
    </div>
</div>
)}

{/* ============================================= */}
{/* READ NEXT START                                */}
{/* ============================================= */}
<section className="read-next">
    <div className="container">
        <h2 className="read-next__title">Read Next</h2>
        <div className="read-next__grid">
            {relatedPosts.map(post => (
                <PostCard 
                    key={post.id}
                    title={post.title || "Untitled Story"}
                    image={post.cover_image || "/assets/images/content/default.jpg"}
                    category={post.category?.split(' - ')[0] || "Story"}
                    author={post.profiles?.username || "Unknown"}
                    date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    isoDate={post.created_at}
                    link={`/post/${post.id}`}
                />
            ))}
        </div>
    </div>
</section>
      </main>
      <Footer />
    </div>
  );
}
