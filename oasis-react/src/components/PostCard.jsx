import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ title, image, category, categoryLink, author, date, isoDate, link = "/post" }) {
    return (
        <article className="post-card">
            <div className="post-card__image">
                <Link to={link} className="post-card__image-link">
                    <img loading="lazy" src={image} alt={title} />
                </Link>
                {category && (
                    <Link 
                        to={categoryLink || `/category?cat=${encodeURIComponent(category.split(' - ')[0])}`}
                        className="post-card__badge"
                        style={{ textDecoration: 'none' }}
                    >
                        {category}
                    </Link>
                )}

                <label className="post-card__save-btn" aria-label="Save post">
                    <input type="checkbox" className="post-card__save-input" />
                    <svg className="post-card__save-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path className="post-card__save-icon-path" d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                </label>
            </div>
            <Link to={link} className="post-card__title-link">
                <h3 className="post-card__title">{title}</h3>
            </Link>
            <div className="post-card__meta">
                <span className="post-card__author">{author}</span>
                <span>&middot;</span>
                <time dateTime={isoDate}>{date}</time>
            </div>
        </article>
    );
}
