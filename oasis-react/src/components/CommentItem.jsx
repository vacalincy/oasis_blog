import React from 'react';

export default function CommentItem({ author, avatar, time, isoTime, text, hasReplies }) {
    return (
        <li className="comment">
            <img loading="lazy" src={avatar} alt={author} className="comment__avatar" />
            <div className="comment__content">
                <div className="comment__body">
                    <p className="comment__author">{author}</p>
                    <time className="comment__time" dateTime={isoTime}>{time}</time>
                    <p className="comment__text">{text}</p>
                    <div className="comment__actions">
                        <label className="comment__like">
                            <input type="checkbox" className="comment__like-input" />
                            <span className="comment__like-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                            <span className="comment__like-count">0</span>
                        </label>
                        <button className="comment__reply">Reply</button>
                    </div>
                </div>
                {hasReplies && (
                    <details className="comment__replies-toggle">
                        <summary className="comment__view-replies">
                            <span className="comment__view-replies-line"></span>
                            <span className="comment__view-replies-closed-text">View replies</span>
                            <span className="comment__view-replies-open-text">Hide replies</span>
                        </summary>
                        <ul className="comment-replies">
                            {/* Nested replies could map here in the future */}
                        </ul>
                    </details>
                )}
            </div>
        </li>
    );
}
