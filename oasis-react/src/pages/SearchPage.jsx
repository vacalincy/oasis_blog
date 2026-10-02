import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const CURATED_BOARDS = [
    {
        id: 1,
        title: "Earthy wedding aesthetic",
        pins: 51,
        mainImg: "/assets/images/content/wedding-1.png",
        smallImg1: "/assets/images/content/wedding-2.png",
        smallImg2: "/assets/images/content/wedding-3.png",
        link: "/category"
    },
    {
        id: 2,
        title: "Sea aesthetic",
        pins: 79,
        mainImg: "/assets/images/content/beach-1.png",
        smallImg1: "/assets/images/content/beach-2.png",
        smallImg2: "/assets/images/content/beach-3.png",
        link: "/category"
    },
    {
        id: 3,
        title: "Urban nights",
        pins: 63,
        mainImg: "/assets/images/content/city-1.jpg",
        smallImg1: "/assets/images/content/city-2.jpg",
        smallImg2: "/assets/images/content/city-3.jpg",
        link: "/category"
    }
];

export default function SearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Update URL without full reload
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="search-page">
            
            {/* SEARCH HERO */}
            <div className="search-hero">
                <img loading="lazy" src="/assets/images/content/banner.jpg" alt="Glass blocks reimagined" className="search-hero__bg" />
                
                <div className="search-top-bar">
                    <button onClick={() => navigate(-1)} className="search-top-bar__back" aria-label="Go back" >
                        <img loading="lazy" src="/assets/images/icons/arrow-left.svg" alt="Back" />
                    </button>
                    <form onSubmit={handleSearch} className="search-bar">
                        <img loading="lazy" src="/assets/images/icons/search.svg" alt="Search icon" />
                        <input 
                            type="text" 
                            placeholder="Search stories..." 
                            aria-label="Search stories"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="search-hero__text">
                    <span className="search-hero__eyebrow">Art deco rediscovered</span>
                    <h2 className="search-hero__title">Glass blocks, reimagined</h2>
                </div>
            </div>

            {/* CURATED BOARDS */}
            <section className="curated-boards-section">
                <div className="container">
                    <span className="curated-boards__eyebrow">Oasis Curated Boards</span>
                    <h2 className="curated-boards__title">Ideas you might like</h2>

                    <div className="curated-boards__scroll">
                        {CURATED_BOARDS.map(board => (
                            <Link key={board.id} to={board.link} className="board-card">
                                <div className="board-card__collage">
                                    <img loading="lazy" src={board.mainImg} alt="Main board" className="board-card__main" />
                                    <img loading="lazy" src={board.smallImg1} alt="Small board 1" className="board-card__small" />
                                    <img loading="lazy" src={board.smallImg2} alt="Small board 2" className="board-card__small" />
                                </div>
                                <p className="board-card__title">{board.title}</p>
                                <span className="board-card__meta">{board.pins} Pins</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
