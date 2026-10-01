import React, { useState } from 'react';
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
  const addToast = useToast();
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  return (
    <div className="single-post-page">
      <Header />
      
      {/* POST HEADER START                              */}
{/* (topic badge + title + author, centered)       */}
{/* ============================================= */}
<section className="post-header">
    <div className="container post-header__container">

        <Link to="/category?cat=sports" className="post-header__badge">
            Action & Extreme
        </Link>

        <h1 className="post-header__title">Defying Gravity: The Art of High-Altitude Snowboarding</h1>

        <Link to="/profile" className="post-header__author">
            <img loading="lazy" src="/assets/images/icons/avatar.svg" alt="Julian Vance" />
            <div className="post-header__author-info">
                <p><b>Julian Vance</b></p>
                <time dateTime="2024-02-12">Feb 12, 2024</time>
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
        <img src="/assets/images/content/discover_main_pc.jpg" alt="Snowboarder in mid-air" className="post-media__img" />
        <p className="post-media__caption">Athlete performing a complex aerial maneuver. Photography by Extreme Winters.</p>
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
    <div className="container post-body__container">

        <h3>The Pursuit of Air</h3>

        <p>Experience the raw thrill of winter sports. From soaring above the halfpipe to mastering complex aerial maneuvers, elite snowboarders are constantly pushing the boundaries of what is humanly possible in sub-zero conditions. It is a sport defined by gravity, momentum, and split-second precision.</p>

        <blockquote>
            "The mountain doesn't care about your sponsor or your board. Up there, it's just you and the physics of the fall."
        </blockquote>

        <p>This approach requires immense mental fortitude. It is much easier to stay grounded than to launch yourself into the freezing air, hoping your body remembers the rotation before gravity claims its due. The elegance we perceive in a perfect landing is the result of rigorous, unseen labor.</p>

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

            {/* LIKE: checkbox hack — checked = red filled heart */}
            <label className="post-actions__btn" aria-label="Like">
                <input type="checkbox" className="post-actions__input post-actions__input--like" />
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                <span>1.2k</span>
            </label>

            {/* COMMENTS: not toggleable, just opens comments — plain button */}
            <button className="post-actions__btn" aria-label="Comments">
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/comment.svg')", width: "20px", height: "20px" }}></span>
                <span>84</span>
            </button>
        </div>

        <div className="post-actions__group">

            {/* SAVE: checkbox hack — checked = dark filled bookmark */}
            <label className="post-actions__btn" aria-label="Save">
                <input type="checkbox" className="post-actions__input post-actions__input--save" />
                <span className="post-actions__icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/bookmark.svg')", width: "16px", height: "16px" }}></span>
            </label>

            {/* SHARE: not toggleable, opens a share sheet — plain button */}
            <button className="post-actions__btn" aria-label="Share" onClick={() => addToast('Link copied to clipboard!', 'success')}>
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
            {/* opens the full comments modal below — logic added later with JS */}
            <button className="comments__view-all" onClick={() => setShowCommentsModal(true)}>View all</button>
        </div>

        {/* --- new comment input --- */}
        <form className="comment-form" onSubmit={(e) => { e.preventDefault(); addToast('Comment submitted!', 'success'); }}>
            <Link to="/dashboard" className="avatar">EA</Link>
            <textarea className="comment-form__input" placeholder="What are your thoughts?" aria-label="Comment text"></textarea>
            <button type="submit" className="comment-form__submit">Respond</button>
        </form>

        {/* --- top 2 comments, sorted by most likes --- */}
        <ul className="comment-list">
            {COMMENTS_DATA.map(comment => (
                <CommentItem key={comment.id} {...comment} />
            ))}
        </ul>

    </div>
</section>

{/* --- full comments modal, hidden until JS toggles it — built now, wired up later --- */}
{showCommentsModal && (
<div className="comments-modal active" id="comments-modal" onClick={(e) => { if (e.target.id === 'comments-modal') setShowCommentsModal(false); }}>
    <div className="comments-modal__content">
        <div className="comments-modal__header">
            <h2>All Responses (128)</h2>
            <button className="comments-modal__close" aria-label="Close" onClick={() => setShowCommentsModal(false)}>✕</button>
        </div>
        {/* full comment list will be repeated/loaded here */}
    </div>
</div>
)}
{/* ============================================= */}
{/* COMMENTS SECTION END                           */}
{/* ============================================= */}


{/* ============================================= */}
{/* READ NEXT START                                */}
{/* (3 related posts, reuses .post-card from home) */}
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
            {/* opens the full comments modal below — logic added later with JS */}
            <button className="comments__view-all" onClick={() => setShowCommentsModal(true)}>View all</button>
        </div>

        {/* --- new comment input --- */}
        <form className="comment-form" onSubmit={(e) => { e.preventDefault(); addToast('Comment submitted!', 'success'); }}>
            <Link to="/dashboard" className="avatar">EA</Link>
            <textarea className="comment-form__input" placeholder="What are your thoughts?" aria-label="Comment text"></textarea>
            <button type="submit" className="comment-form__submit">Respond</button>
        </form>

        {/* --- top 2 comments, sorted by most likes --- */}
        <ul className="comment-list">
            {COMMENTS_DATA.map(comment => (
                <CommentItem key={comment.id} {...comment} />
            ))}
        </ul>

    </div>
</section>

{/* --- full comments modal, hidden until JS toggles it — built now, wired up later --- */}
{showCommentsModal && (
<div className="comments-modal active" id="comments-modal" onClick={(e) => { if (e.target.id === 'comments-modal') setShowCommentsModal(false); }}>
    <div className="comments-modal__content">
        <div className="comments-modal__header">
            <h2>All Responses (128)</h2>
            <button className="comments-modal__close" aria-label="Close" onClick={() => setShowCommentsModal(false)}>✕</button>
        </div>
        {/* full comment list will be repeated/loaded here */}
    </div>
</div>
)}
{/* ============================================= */}
{/* COMMENTS SECTION END                           */}
{/* ============================================= */}


{/* ============================================= */}
{/* READ NEXT START                                */}
{/* (3 related posts, reuses .post-card from home) */}
{/* ============================================= */}
<section className="read-next">
    <div className="container">

        <h2 className="read-next__title">Read Next</h2>

        <div className="read-next__grid">

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/robot.jpg" alt="Humanoid robot" />
                    </Link>
                    <span className="post-card__badge">Robotics</span>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">How AI is Shaping the Next Generation of Robotics</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">John Smith</span>
                    <span>·</span>
                    <time dateTime="2023-11-05">Nov 05, 2023</time>
                </div>
            </article>

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/interior.jpg" alt="Minimalist living room" />
                    </Link>
                    <span className="post-card__badge">Architecture</span>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Minimalist Spaces That Inspire Creativity</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">Sarah Brown</span>
                    <span>·</span>
                    <time dateTime="2024-02-02">Feb 02, 2024</time>
                </div>
            </article>

            <article className="post-card">
                <div className="post-card__image">
                    <Link to="/post" className="post-card__image-link">
                        <img loading="lazy" src="/assets/images/content/sunrise.jpg" alt="Person meditating at sunrise" />
                    </Link>
                    <span className="post-card__badge">Lifestyle</span>
                </div>
                <Link to="/post" className="post-card__title-link">
                    <h3 className="post-card__title">Creating a Morning Routine for Maximum Productivity</h3>
                </Link>
                <div className="post-card__meta">
                    <span className="post-card__author">Chris Wilson</span>
                    <span>·</span>
                    <time dateTime="2024-05-18">May 18, 2024</time>
                </div>
            </article>

        </div>

    </div>
</section>
{/* ============================================= */}
{/* READ NEXT END                                  */}
{/* ============================================= */}




      <Footer />
    </div>
  );
}
