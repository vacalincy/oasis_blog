import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PostPage() {
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
            {/* opens the full comments modal below — logic added later with JS */}
            <button className="comments__view-all" data-modal-target="comments-modal">View all</button>
        </div>

        {/* --- new comment input --- */}
        <form className="comment-form">
            <a href="dashboard.html" className="avatar">EA</a>
            <textarea className="comment-form__input" placeholder="What are your thoughts?" aria-label="Comment text"></textarea>
            <button type="submit" className="comment-form__submit">Respond</button>
        </form>

        {/* --- top 2 comments, sorted by most likes --- */}
        <ul className="comment-list">

            <li className="comment">
                <img loading="lazy" src="/assets/images/avatars/marcus.jpg" alt="Marcus Chen" className="comment__avatar" />
                <div className="comment__body">
                    <p className="comment__author">Marcus Chen</p>
                    <time className="comment__time" dateTime="2023-10-12T10:00">2 hours ago</time>
                    <p className="comment__text">The quote about material honesty really struck a chord. I've been trying to renovate my studio and the urge to just paint over raw concrete is strong, but there's something so beautiful about leaving it exposed.</p>
                    <div className="comment__actions">
                        <label className="comment__like">
                            <input type="checkbox" className="comment__like-input" />
                            <span className="comment__like-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                            12
                        </label>
                        <button className="comment__reply">Reply</button>
                    </div>
                </div>
            </li>

            <li className="comment">
                <img loading="lazy" src="/assets/images/avatars/elena.jpg" alt="Elena Rodriguez" className="comment__avatar" />

                <div className="comment__content">
                    <div className="comment__body">
                        <p className="comment__author">Elena Rodriguez</p>
                        <time className="comment__time" dateTime="2023-10-12T05:00">5 hours ago</time>
                        <p className="comment__text">Great read. Though I'd argue that true minimalism is a luxury of those who don't have to hoard items out of necessity. It's an aesthetic that requires a certain level of privilege to maintain perfectly.</p>
                        <div className="comment__actions">
                            <label className="comment__like">
                                <input type="checkbox" className="comment__like-input" />
                                <span className="comment__like-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                                12
                            </label>
                            <button className="comment__reply">Reply</button>
                        </div>
                    </div>

                    <details className="reply-toggle">
                        <summary className="comment__view-replies">
                            <span className="comment__view-replies-line"></span>
                            <span className="comment__view-replies-closed-text">View 2 replies</span>
                            <span className="comment__view-replies-open-text">Hide replies</span>
                        </summary>

                        <ul className="reply-list">
                            <li className="reply">
                                <p className="reply__author">Marcus Chen</p>
                                <time className="reply__time" dateTime="2023-10-12T06:00">4 hours ago</time>
                                <p className="reply__text">I see your point, but I'd say minimalism can also be a discipline anyone can practice, regardless of means — it's more about intention than privilege.</p>
                            </li>
                            <li className="reply">
                                <p className="reply__author">Jane Doe</p>
                                <time className="reply__time" dateTime="2023-10-12T07:00">3 hours ago</time>
                                <p className="reply__text">Fair point, Elena. Though I'd argue the "curated" version of minimalism sold online is what actually requires privilege — the underlying idea doesn't have to.</p>
                            </li>
                        </ul>
                    </details>

                </div>
            </li>

        </ul>

    </div>
</section>

{/* --- full comments modal, hidden until JS toggles it — built now, wired up later --- */}
<div className="comments-modal" id="comments-modal">
    <div className="comments-modal__content">
        <div className="comments-modal__header">
            <h2>All Responses (128)</h2>
            <button className="comments-modal__close" aria-label="Close">✕</button>
        </div>
        {/* full comment list will be repeated/loaded here */}
    </div>
</div>
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
