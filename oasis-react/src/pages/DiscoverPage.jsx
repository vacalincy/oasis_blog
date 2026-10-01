import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';

const DISCOVER_POSTS = [
    {
        id: 1,
        title: "Reading a City: Urban Topography and the Modern Flâneur",
        image: "/assets/images/content/abstractstairs.jpg",
        category: "Photography & Film",
        author: "Bastian",
        date: "Jan 12, 2024",
        isoDate: "2024-01-12",
        link: "/post"
    },
    {
        id: 2,
        title: "A Moment in the Sun: The Lost Art of Waiting",
        image: "/assets/images/content/mainfeed2.jpg",
        category: "Design & Interfaces",
        author: "Jack",
        date: "Oct 24, 2023",
        isoDate: "2023-10-24",
        link: "/post"
    },
    {
        id: 3,
        title: "Brutalist Typography: Breaking the Grid in Print",
        image: "/assets/images/content/mainfeed3.jpg",
        category: "Design & Interfaces",
        author: "Sarah Jenkins",
        date: "Jan 28, 2024",
        isoDate: "2024-01-28",
        link: "/post"
    },
    {
        id: 4,
        title: "Vertical Ice: The Psychology of Crevasse Climbing",
        image: "/assets/images/content/mainfeed4.jpg",
        category: "Action & Extreme",
        author: "David Chen",
        date: "Feb 05, 2024",
        isoDate: "2024-02-05",
        link: "/post"
    },
    {
        id: 5,
        title: "The Future of Virtual Reality in Modern Education",
        image: "/assets/images/content/vr.jpg",
        category: "Science & Technology",
        author: "Jane Doe",
        date: "Oct 12, 2023",
        isoDate: "2023-10-12",
        link: "/post"
    },
    {
        id: 6,
        title: "The Future of Virtual Reality in Modern Education",
        image: "/assets/images/content/vr.jpg",
        category: "Science & Technology",
        author: "Jane Doe",
        date: "Oct 12, 2023",
        isoDate: "2023-10-12",
        link: "/post"
    },
    {
        id: 7,
        title: "The Future of Virtual Reality in Modern Education",
        image: "/assets/images/content/vr.jpg",
        category: "Science & Technology",
        author: "Jane Doe",
        date: "Oct 12, 2023",
        isoDate: "2023-10-12",
        link: "/post"
    },
    {
        id: 8,
        title: "The Future of Virtual Reality in Modern Education",
        image: "/assets/images/content/vr.jpg",
        category: "Science & Technology",
        author: "Jane Doe",
        date: "Oct 12, 2023",
        isoDate: "2023-10-12",
        link: "/post"
    }
];

export default function DiscoverPage() {
  return (
    <div className="discover-page">
      <Header />
      
      {/* FEATURED POST SECTION START                    */}
{/* ============================================= */}
<section className="featured-post-section">
    <div className="container">
        <div className="featured-post">

            {/* Left column: image, links to the full post */}
            <Link to="/post" className="featured-post__link">
                <img src="/assets/images/content/discover_main_pc.jpg" alt="Snowboarding" />
            </Link>

            {/* Right column: badge, title, text, author */}
            <div className="featured-post__content">

                {/* category badge, links to the category archive */}
                <Link to="/category?cat=sports" className="featured-post__badge">
                    <span className="featured-post__title">Action & Extreme</span>
                </Link>

                {/* title + text group */}
                <div className="featured-post__info">

                    {/* title also links to the full post, same as the image */}
                    <Link to="/post" className="featured-post__title-link">
                        <h2>Defying Gravity: The Art of High-Altitude Snowboarding</h2>
                    </Link>

                    <p>Experience the raw thrill of winter sports. From soaring above the halfpipe to mastering complex aerial maneuvers, elite snowboarders are constantly pushing the boundaries of what is humanly possible in sub-zero conditions.</p>

                </div>

                {/* author block, pinned to the bottom via CSS — links to the author's profile page */}
                <Link to="/profile" className="featured-post__author">
                    <img loading="lazy" src="/assets/images/icons/avatar.svg" alt="Julian Vance" />
                    <div className="featured-post__author__name">
                        <p><b>Julian Vance</b></p>
                        <time dateTime="2024-02-12">February 12, 2024</time>
                    </div>
                </Link>

            </div>

        </div>
    </div>
</section>
{/* ============================================= */}
{/* FEATURED POST SECTION END                      */}
{/* ============================================= */}


{/* ============================================= */}
{/* LATEST POSTS SECTION START                     */}
{/* ============================================= */}

<section className="latest-posts-section">

    <div className="container">

        <div className="section-header">
            <h2>Explore the latest</h2>
            <ul className="filters">
                <li><button className="filter-btn active" data-filter="all">All</button></li>
                <li><button className="filter-btn" data-filter="design">Design</button></li>
                <li><button className="filter-btn" data-filter="technology">Technology</button></li>
                <li><button className="filter-btn" data-filter="lifestyle">Lifestyle</button></li>
            </ul>
        </div>

        <div className="posts-grid">
                    {DISCOVER_POSTS.map(post => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>

        <button className="load-more-btn">Load More Stories</button>

    </div>
</section>

{/* ============================================= */}
{/* LATEST POSTS SECTION END                       */}
{/* ============================================= */}






      <Footer />
    </div>
  );
}
