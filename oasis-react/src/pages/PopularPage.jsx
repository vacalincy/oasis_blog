import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';

export default function PopularPage() {
  return (
    <div className="popular-page">
      <Header />
      
      {/* SECTION 1: HERO (gradient + centered title)    */}
{/* ============================================= */}
<section className="popular-hero">
    <h1 className="popular-hero__title"><SplitText text="Timeless Reads And Current Trends." /></h1>
</section>
{/* ============================================= */}
{/* SECTION 1: HERO END                            */}
{/* ============================================= */}


{/* ============================================= */}
{/* SECTION 1.5: POPULAR PICKS (3-card grid)       */}
{/* ============================================= */}
<section className="popular-picks">
    <div className="container popular-picks__grid">

        {/* Card 1 */}
        <article className="pick-card">
            <Link to="/post" className="pick-card__image">
                <img loading="lazy" src="/assets/images/content/dunes.jpg" alt="Warm Palettes & Natural Textures" />
            </Link>
            <div className="pick-card__overlay">
                <span className="pick-card__badge">Design &amp; Interfaces</span>
                <h3 className="pick-card__title">
                    <Link to="/post">Warm Palettes &amp; Natural <br />Textures</Link>
                </h3>
                <div className="pick-card__footer">
                    <p className="pick-card__excerpt">How to draw inspiration from extreme landscapes to build</p>
                    <Link to="/post" className="pick-card__arrow" aria-label="Read article">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </article>

        {/* Card 2 */}
        <article className="pick-card">
            <Link to="/post" className="pick-card__image">
                <img loading="lazy" src="/assets/images/content/lake-mountains.jpg" alt="Alpine Routes: The Ultimate Hiking Guide" />
            </Link>
            <div className="pick-card__overlay">
                <span className="pick-card__badge">Travel &amp; Outdoors</span>
                <h3 className="pick-card__title">
                    <Link to="/post">Alpine Routes: The Ultimate <br />Hiking Guide</Link>
                </h3>
                <div className="pick-card__footer">
                    <p className="pick-card__excerpt">Planning your next mountain hike with essential gear checklists</p>
                    <Link to="/post" className="pick-card__arrow" aria-label="Read article">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </article>

        {/* Card 3 */}
        <article className="pick-card">
            <Link to="/post" className="pick-card__image">
                <img loading="lazy" src="/assets/images/content/field-tree.jpg" alt="Mastering Exposure in Bright Backlight" />
            </Link>
            <div className="pick-card__overlay">
                <span className="pick-card__badge">Photography &amp; Film</span>
                <h3 className="pick-card__title">
                    <Link to="/post">Mastering Exposure in <br />Bright Backlight</Link>
                </h3>
                <div className="pick-card__footer">
                    <p className="pick-card__excerpt">Technical camera settings for managing harsh sunlight and</p>
                    <Link to="/post" className="pick-card__arrow" aria-label="Read article">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </article>

    </div>
</section>
{/* ============================================= */}
{/* SECTION 1.5: POPULAR PICKS END                 */}
{/* ============================================= */}


{/* ============================================= */}
{/* SECTION 1: TRENDING THIS WEEK START             */}
{/* ============================================= */}
<section className="trending">

    <div className="trending__bar">
        <span className="trending__label">This Week</span>
        <div className="trending__filters">
            <button className="trending__filter-btn active">This Week</button>
            <button className="trending__filter-btn">This Month</button>
            <button className="trending__filter-btn">All Time</button>
        </div>
    </div>

    <ul className="trending__list">
        <li className="trending__item">
            <span className="trending__number">01</span>
            <Link to="/post" className="trending__title">The Art of Mountain Photography</Link>
        </li>
        <li className="trending__item">
            <span className="trending__number">02</span>
            <Link to="/post" className="trending__title">Designing Responsive Layouts</Link>
        </li>
        <li className="trending__item">
            <span className="trending__number">03</span>
            <Link to="/post" className="trending__title">Advanced Typography in Web Design</Link>
        </li>
    </ul>

</section>
{/* ============================================= */}
{/* SECTION 1: TRENDING THIS WEEKEND               */}
{/* ============================================= */}


{/* ============================================= */}
{/* SECTION 2: ALL-TIME CLASSICS START              */}
{/* ============================================= */}
<section className="classics">

    <div className="classics__header">
        <h2 className="classics__title">All-Time <br />Classics</h2>
    </div>

    {/* row 1 — image left, text right */}
    <article className="classics__row">
        <div className="classics__image">
            <Link to="/post">
                <img loading="lazy" src="/assets/images/content/concert_box.jpg" alt="Crowd at a concert with stage lights" />
            </Link>
        </div>
        <div className="classics__content">
            <Link to="/category?cat=music" className="classics__badge">Music</Link>

            <h3 className="classics__row-title">
                <Link to="/post" className="classics__title-link"><SplitText text="The Evolution of Progressive Rock: Pink Floyd & Led Zeppelin" /></Link>
            </h3>

            <p className="classics__excerpt">How two bands stretched the three-minute single into sprawling, cinematic suites — and quietly rewrote the rules of the album.</p>

            <div className="classics__meta">
                <Link to="/profile" className="classics__author">Jane Doe</Link>
                <span>·</span>
                <time dateTime="2023-10-12">Oct 12, 2023</time>
            </div>

            <Link to="/post" className="classics__link">Read Article ↗</Link>
        </div>
    </article>

    {/* row 2 — text left, image right */}
    <article className="classics__row classics__row--reverse">
        <div className="classics__content">
            <Link to="/category?cat=technology" className="classics__badge">Technology</Link>

            <h3 className="classics__row-title">
                <Link to="/post" className="classics__title-link"><SplitText text="Mastering CSS Grid & Flexbox Layouts" /></Link>
            </h3>

            <p className="classics__excerpt">A practical field guide to comparing resilient, two-dimensional layouts — when to reach for grid, when flexbox wins, and how to set them cooperate.</p>

            <div className="classics__meta">
                <Link to="/profile" className="classics__author">Jane Doe</Link>
                <span>·</span>
                <time dateTime="2023-10-12">Oct 12, 2023</time>
            </div>

            <Link to="/post" className="classics__link">Read Article ↗</Link>
        </div>
        <div className="classics__image">
            <Link to="/post">
                <img loading="lazy" src="/assets/images/content/select_box.jpg" alt="Modern building facade" />
            </Link>
        </div>
    </article>

</section>
{/* ============================================= */}
{/* SECTION 2: ALL-TIME CLASSICS END                */}
{/* ============================================= */}


<section className="discussions">

    <h2 className="discussions__title">Hot Discussions</h2>

    <div className="discussions__item">
        <input type="checkbox" id="discussion-1" className="discussions__toggle-input" checked />
        <div className="discussions__row">
            <Link to="/post" className="discussions__title-link">Sony A6400: Perfect Settings for Backlit Mountains</Link>
            <label htmlFor="discussion-1" className="discussions__toggle-btn" aria-label="Toggle discussion"></label>
        </div>
        <div className="discussions__body">
            <p className="discussions__text">Achieving the perfect exposure when shooting directly into the sun requires balancing your highlights while recovering shadow detail. In this discussion, users share their custom profiles and metering modes for capturing crisp silhouettes and vibrant sunbeams using Sony's APS-C mirrorless systems.</p>
            <img loading="lazy" src="/assets/images/content/sony.jpg" alt="Backlit mountain landscape" className="discussions__image" />
        </div>
    </div>

    <div className="discussions__item">
        <input type="checkbox" id="discussion-2" className="discussions__toggle-input" />
        <div className="discussions__row">
            <Link to="/post" className="discussions__title-link">The Ultimate Quinoa &amp; Bulgur Guide</Link>
            <label htmlFor="discussion-2" className="discussions__toggle-btn" aria-label="Toggle discussion"></label>
        </div>
        <div className="discussions__body">
            <p className="discussions__text">A deep dive into cooking ratios, soaking times, and flavor pairings for two of the most versatile ancient grains.</p>
        </div>
    </div>

    <div className="discussions__item">
        <input type="checkbox" id="discussion-3" className="discussions__toggle-input" />
        <div className="discussions__row">
            <Link to="/post" className="discussions__title-link">Troubleshooting the Apple Ecosystem</Link>
            <label htmlFor="discussion-3" className="discussions__toggle-btn" aria-label="Toggle discussion"></label>
        </div>
        <div className="discussions__body">
            <p className="discussions__text">A running thread collecting fixes for the most common sync, Handoff, and iCloud issues across iPhone, Mac, and iPad.</p>
        </div>
    </div>

</section>




      <Footer />
    </div>
  );
}
