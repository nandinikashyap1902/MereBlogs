import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';
import '../styles/Comments.css';

/**
 * Comments — full comment section for a post.
 * Shows comment list + add comment form (for logged-in users).
 */
export default function Comments({ postId }) {
    const { userInfo } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch comments on mount / when postId changes
    useEffect(() => {
        setLoading(true);
        apiFetch(`/post/${postId}/comments`)
            .then(res => res.json())
            .then(data => setComments(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, [postId]);

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!text.trim()) return;

        setSubmitting(true);
        setError('');
        try {
            const res = await apiFetch(`/post/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ content: text.trim() }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to post comment.');
            }
            const newComment = await res.json();
            setComments(prev => [newComment, ...prev]);  // prepend — optimistic UI
            setText('');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(commentId) {
        if (!window.confirm('Delete this comment?')) return;
        try {
            const res = await apiFetch(`/comment/${commentId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete.');
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            alert(err.message);
        }
    }

    const name = (username) => username?.split('@')[0] ?? username;

    return (
        <section className="comments-section">
            <h3 className="comments-title">
                💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>

            {/* Add comment form — only if logged in */}
            {userInfo?.username ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <textarea
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={text}
                        onChange={ev => setText(ev.target.value)}
                        maxLength={1000}
                        rows={3}
                    />
                    <div className="comment-form__footer">
                        <span className="comment-char-count">{text.length}/1000</span>
                        <button
                            className="comment-submit-btn"
                            type="submit"
                            disabled={submitting || !text.trim()}
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                    {error && <p className="comment-error">{error}</p>}
                </form>
            ) : (
                <p className="comment-login-prompt">
                    <Link to="/login">Log in</Link> to leave a comment.
                </p>
            )}

            {/* Comment list */}
            {loading ? (
                <p className="comment-loading">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="comment-empty">No comments yet. Be the first!</p>
            ) : (
                <ul className="comment-list">
                    {comments.map(comment => (
                        <li key={comment._id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">@{name(comment.author?.username)}</span>
                                <span className="comment-date">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                                {/* Delete button — only visible to the comment's author */}
                                {userInfo?.id === comment.author?._id && (
                                    <button
                                        className="comment-delete-btn"
                                        onClick={() => handleDelete(comment._id)}
                                        title="Delete comment"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
