import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CommentItem from '../components/CommentItem';


const COMMENTS_DATA = [
    {
        id: 1,
        author: "Marcus Chen",
        avatar: "/assets/images/avatars/marcus.jpg",
        time: "2 hours ago",
        isoTime: "2023-10-12T10:00",
        text: "The quote about material honesty really struck a chord. I've been trying to renovate my studio and the urge to just paint over raw concrete is strong, but there's something so beautiful about leaving it exposed.",
        hasReplies: false
    },
    {
        id: 2,
        author: "Elena Rodriguez",
        avatar: "/assets/images/avatars/elena.jpg",
        time: "5 hours ago",
        isoTime: "2023-10-12T05:00",
        text: "Great read. Though I'd argue that true minimalism is a luxury of those who don't have to hoard items out of necessity. It's an aesthetic that requires a certain level of privilege to maintain perfectly.",
        hasReplies: true
    }
];


export default function PostPage() {
  const { id } = useParams();
  const addToast = useToast();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, profile } = useAuth();
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
        setLoading(true);
        if (!id) return;
        
        const { data, error } = await supabase
            .from('posts')
            .select('*, profiles(username, avatar_url)')
            .eq('id', id)
            .single();
            
        if (error) {
            addToast('Error loading post: ' + error.message, 'error');
        } else {
            setPost(data);
            
            // Fetch related posts (same category)
            let { data: relatedData } = await supabase
                .from('posts')
                .select('*, profiles(username, avatar_url)')
                .eq('status', 'published')
                .eq('category', data.category)
                .neq('id', data.id)
                .order('created_at', { ascending: false })
                .limit(3);
                
            if (relatedData && relatedData.length < 3) {
                // Fallback to latest posts overall if we don't have enough in this category
                const { data: fallbackData } = await supabase
                    .from('posts')
                    .select('*, profiles(username, avatar_url)')
                    .eq('status', 'published')
                    .neq('id', data.id)
                    .order('created_at', { ascending: false })
                    .limit(3);
                relatedData = fallbackData;
            }
            
            if (relatedData) {
                setRelatedPosts(relatedData);
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

        <Link to={`/profile/${post.author_id}`} className="post-header__author">
            <img loading="lazy" src={post.profiles?.avatar_url || "/assets/images/icons/avatar.svg"} alt={post.profiles?.username} />
            <div className="post-header__author-info">
                <p><b>{post.profiles?.username || 'Unknown Author'}</b></p>
                <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
            </div>
        </Link>

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
            <label className="post-actions__btn" aria-label="Like">
                <input type="checkbox" className="post-actions__input post-actions__input--like" checked={isLiked} onChange={handleLike} />
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                <span>{likesCount}</span>
            </label>

            <button className="post-actions__btn" aria-label="Comments" onClick={() => setShowCommentsModal(true)}>
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/comment.svg')", width: "20px", height: "20px" }}></span>
                <span>{comments.length}</span>
            </button>
        </div>

        <div className="post-actions__group">
            <label className="post-actions__btn" aria-label="Save">
                <input type="checkbox" className="post-actions__input post-actions__input--save" checked={isSaved} onChange={handleSave} />
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/bookmark.svg')", width: "16px", height: "16px" }}></span>
            </label>
            
            <button className="post-actions__btn" aria-label="Share">
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/share.svg')", width: "16px", height: "16px" }}></span>
            </button>
        </div>

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

        <form className="comment-form" onSubmit={handleCommentSubmit}>
            <Link to="/dashboard" className="avatar" style={profile?.avatar_url ? { backgroundImage: `url(${profile.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}>
                {!profile?.avatar_url && (profile?.username ? profile.username.substring(0,2).toUpperCase() : (user ? user.email.substring(0,2).toUpperCase() : "GU"))}
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
