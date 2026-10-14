import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export default function CommentItem({ id, post_id, author_id, author, avatar, time, isoTime, text }) {
    const { user } = useAuth();
    const addToast = useToast();
    const { createNotification } = useNotifications();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [replies, setReplies] = useState([]);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchLikes = async () => {
            const { count } = await supabase
                .from('comment_likes')
                .select('*', { count: 'exact', head: true })
                .eq('comment_id', id);
            if (count !== null) setLikesCount(count);
            
            if (user) {
                const { data } = await supabase
                    .from('comment_likes')
                    .select('id')
                    .eq('comment_id', id)
                    .eq('user_id', user.id)
                    .maybeSingle();
                setIsLiked(!!data);
            }
        };
                const fetchReplies = async () => {
            const { data } = await supabase
                .from('comments')
                .select('*, profiles(username, avatar_url)')
                .eq('parent_id', id)
                .order('created_at', { ascending: true });
            if (data) setReplies(data);
        };
        fetchLikes();
        fetchReplies();
    }, [id, user]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            addToast("Please login to reply", "info");
            return;
        }
        if (!replyText.trim()) return;

        setIsSubmittingReply(true);
        const { data, error } = await supabase
            .from('comments')
            .insert({ post_id, user_id: user.id, text: replyText.trim(), parent_id: id })
            .select('*, profiles(username, avatar_url)')
            .single();
            
        setIsSubmittingReply(false);
        if (data && !error) {
            setReplies([...replies, data]);
            setReplyText("");
            setIsReplying(false);
            addToast("Reply posted!", "success");
            if (author_id && author_id !== user.id) {
                createNotification({
                    userId: author_id,
                    actorId: user.id,
                    type: 'comment',
                    postId: post_id,
                    content: replyText.trim()
                });
            }
        } else {
            addToast("Error: " + error.message, "error");
            console.error("Reply insert error:", error);
        }
    };

    const handleConfirmDelete = async () => {
        const { error } = await supabase.from('comments').delete().eq('id', id);
        if (error) {
            addToast("Error deleting: " + error.message, "error");
            setShowDeleteModal(false);
        } else {
            setIsDeleted(true);
            setShowDeleteModal(false);
            addToast("Comment deleted", "success");
        }
    };

    const handleLike = async () => {
        if (!user) {
            addToast("Please login to like comments", "info");
            return;
        }
        const previousLiked = isLiked;
        const previousCount = likesCount;
        setIsLiked(!previousLiked);
        setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);
        
        if (!previousLiked) {
            await supabase.from('comment_likes').insert({ comment_id: id, user_id: user.id });
        } else {
            await supabase.from('comment_likes').delete().eq('comment_id', id).eq('user_id', user.id);
        }
    };
    if (isDeleted) return null;

    return (
        <li className="comment">
            <Link to={`/profile/${author_id}`}>
                <img 
                    decoding="async" 
                    src={avatar} 
                    alt={author} 
                    className="comment__avatar" 
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/icons/avatar.svg'; }}
                    style={{ cursor: 'pointer', border: '2px solid transparent', aspectRatio: '1 / 1', objectFit: 'cover' }} 
                />
            </Link>
            <div className="comment__content">
                <div className="comment__body">
                    <Link to={`/profile/${author_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <p className="comment__author" style={{ cursor: 'pointer' }}>{author}</p>
                    </Link>
                    <time className="comment__time" dateTime={isoTime}>{time}</time>
                    <p className="comment__text">{text}</p>
                </div>
                <div className="comment__actions" style={{ paddingLeft: '8px' }}>
                    {user ? (
                        <label className="comment__like">
                            <input type="checkbox" className="comment__like-input" checked={isLiked} onChange={handleLike} />
                            <span className="comment__like-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px" }}></span>
                            <span className="comment__like-count">{likesCount}</span>
                        </label>
                    ) : (
                        <span className="comment__like comment__like--readonly">
                            <span className="comment__like-icon dynamic-icon" style={{ WebkitMaskImage: "url('/assets/images/icons/heart.svg')", width: "16px", height: "16px", opacity: 0.6 }}></span>
                            <span className="comment__like-count">{likesCount}</span>
                        </span>
                    )}
                    {user && (
                        <button className="comment__reply" onClick={() => setIsReplying(!isReplying)} style={{ border: 'none', background: 'none', color: 'var(--color-text-secondary)', fontWeight: '500', cursor: 'pointer' }}>Reply</button>
                    )}
                    {user && user.id === author_id && (
                        <button onClick={() => setShowDeleteModal(true)} style={{ border: 'none', background: 'none', color: 'var(--color-text-secondary)', fontWeight: '500', cursor: 'pointer', marginLeft: '8px', fontSize: '0.9rem' }}>Delete</button>
                    )}
                </div>
                {isReplying && (
                    <form style={{ display: 'flex', flexDirection: 'column', marginTop: '16px', gap: '12px' }} onSubmit={handleReplySubmit}>
                        <textarea 
                            className="comment-form__input" 
                            placeholder="Write a reply..." 
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            disabled={isSubmittingReply}
                            style={{ minHeight: '80px', width: '100%', padding: '12px 16px' }}
                        ></textarea>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button type="button" onClick={() => setIsReplying(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                                Cancel
                            </button>
                            <button type="submit" className="comment-form__submit" disabled={isSubmittingReply || !replyText.trim()}>
                                {isSubmittingReply ? "..." : "Post Reply"}
                            </button>
                        </div>
                    </form>
                )}

                {replies.length > 0 && (
                    <details className="comment__replies-toggle" style={{ marginTop: '16px' }}>
                        <summary className="comment__view-replies">
                            <span className="comment__view-replies-line"></span>
                            <span className="comment__view-replies-closed-text">View {replies.length} repl{replies.length === 1 ? 'y' : 'ies'}</span>
                            <span className="comment__view-replies-open-text">Hide replies</span>
                        </summary>
                        <ul className="comment-replies" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px", listStyle: "none", padding: 0 }}>
                            {replies.map(reply => (
                                <CommentItem 
                                    key={reply.id} 
                                    id={reply.id}
                                    post_id={post_id}
                                    author_id={reply.user_id}
                                    author={reply.profiles?.username || "Unknown"}
                                    avatar={reply.profiles?.avatar_url || "/assets/images/icons/avatar.svg"}
                                    time={new Date(reply.created_at).toLocaleDateString()}
                                    isoTime={reply.created_at}
                                    text={reply.text}
                                />
                            ))}
                        </ul>
                    </details>
                )}
                {showDeleteModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ backgroundColor: 'var(--color-bg)', padding: '24px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginTop: 0, color: 'var(--color-text-main)', fontSize: '1.2rem', marginBottom: '12px' }}>Delete Comment</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>Are you sure you want to delete this comment? This action cannot be undone.</p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid #eef2f6', background: 'transparent', color: 'var(--color-text-main)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button onClick={handleConfirmDelete} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}
