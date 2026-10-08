import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
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

const RELATED_POSTS = [
    {
        id: 1,
        title: "The Architecture of Silence: Finding Peace in Brutalism",
        image: "/assets/images/content/011.jpg",
        category: "Architecture",
        author: "Marcus Chen",
        date: "Oct 10, 2023",
        isoDate: "2023-10-10"
    },
    {
        id: 2,
        title: "Japanese Woodworking and the Philosophy of Perfection",
        image: "/assets/images/content/008.jpg",
        category: "Design",
        author: "Sarah Jenkins",
        date: "Oct 05, 2023",
        isoDate: "2023-10-05"
    },
    {
        id: 3,
        title: "Monochrome Spaces: Why Less Color Can Mean More",
        image: "/assets/images/content/010.jpg",
        category: "Interior",
        author: "Elena Rostova",
        date: "Sep 28, 2023",
        isoDate: "2023-09-28"
    }
];

export default function PostPage() {
  const { id } = useParams();
  const addToast = useToast();
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        <Link to={`/category?cat=${post.category}`} className="post-header__badge">
            {post.category?.split(' - ')[0] || 'Story'}
        </Link>

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
                <input type="checkbox" className="post-actions__input post-actions__input--like" />
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                <span>1.2k</span>
            </label>

            <button className="post-actions__btn" aria-label="Comments" onClick={() => setShowCommentsModal(true)}>
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/comment.svg')", width: "20px", height: "20px" }}></span>
                <span>84</span>
            </button>
        </div>

        <div className="post-actions__group">
            <label className="post-actions__btn" aria-label="Save">
                <input type="checkbox" className="post-actions__input post-actions__input--save" />
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
            <h2 className="comments__title">Responses (128)</h2>
            <button className="comments__view-all" onClick={() => setShowCommentsModal(true)}>View all</button>
        </div>

        <form className="comment-form" onSubmit={(e) => { e.preventDefault(); addToast('Comment submitted!', 'success'); }}>
            <Link to="/dashboard" className="avatar">EA</Link>
            <textarea className="comment-form__input" placeholder="What are your thoughts?" aria-label="Comment text"></textarea>
            <button type="submit" className="comment-form__submit">Respond</button>
        </form>

        <ul className="comment-list">
            {COMMENTS_DATA.map(comment => (
                <CommentItem key={comment.id} {...comment} />
            ))}
        </ul>

    </div>
</section>

{showCommentsModal && (
<div className="comments-modal active" id="comments-modal" onClick={(e) => { if (e.target.id === 'comments-modal') setShowCommentsModal(false); }}>
    <div className="comments-modal__content">
        <div className="comments-modal__header">
            <h2>All Responses (128)</h2>
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
            {RELATED_POSTS.map(post => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    </div>
</section>
      </main>
      <Footer />
    </div>
  );
}
