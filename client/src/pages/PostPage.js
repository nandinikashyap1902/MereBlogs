import { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';
import DOMPurify from 'dompurify';
import { UserContext } from '../context/UserContext';
import { apiFetch, assetUrl } from '../utils/api';
import { PostPageSkeleton } from '../components/Skeleton';
import '../styles/App.css';
import '../styles/Skeleton.css';
import Swal from 'sweetalert2';

export function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        apiFetch(`/post/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Post not found.');
                return res.json();
            })
            .then(postinfo => {
                setPostInfo(postinfo);
                setLikeCount(postinfo.likeCount ?? (postinfo.likes ? postinfo.likes.length : 0));
                // Check if the current user has already liked
                if (userInfo?.id && postinfo.likes) {
                    setIsLiked(postinfo.likes.includes(userInfo.id));
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id, userInfo?.id]);

    async function toggleLike() {
        if (!userInfo?.id) {
            Swal.fire('Login required', 'Please log in to like posts.', 'info');
            return;
        }
        setLikeLoading(true);
        try {
            const res = await apiFetch(`/post/${id}/like`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to toggle like.');
            const data = await res.json();
            setLikeCount(data.likeCount);
            setIsLiked(data.isLiked);
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setLikeLoading(false);
        }
    }

    async function deletePost() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(result => {
            if (result.isConfirmed) {
                apiFetch(`/post/${id}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire('Deleted!', 'Your post has been deleted successfully.', 'success');
                            setRedirect(true);
                        } else {
                            Swal.fire('Error!', 'Failed to delete the post.', 'error');
                        }
                    })
                    .catch(() => Swal.fire('Error!', 'An error occurred while deleting the post.', 'error'));
            }
        });
    }

    if (redirect) return <Navigate to="/posts" />;
    if (loading) return <PostPageSkeleton />;
    if (error) return <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>;
    if (!postInfo) return null;

    const safeContent = DOMPurify.sanitize(postInfo.content);

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>

            {/* ── Engagement bar: likes + views ── */}
            <div className="engagement-bar">
                <button
                    className={`like-btn ${isLiked ? 'like-btn--active' : ''}`}
                    onClick={toggleLike}
                    disabled={likeLoading}
                    aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#e91e63' : 'none'} stroke={isLiked ? '#e91e63' : 'currentColor'} strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                </button>

                <span className="engagement-bar__item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    {postInfo.views ?? 0} Views
                </span>
            </div>

            <div className="post-page">
                <div className="image">
                    {userInfo?.id === postInfo.author._id && (
                        <div className="edit-row">
                            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </Link>
                            <Link onClick={deletePost} className="delete-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="100" viewBox="0 0 50 50">
                                    <path d="M 25 3.0605469 L 24.5 3.3496094 L 8.5 12.587891 L 8 12.876953 L 8 13.453125 L 8 15.761719 L 8 16.339844 L 8.5019531 16.628906 L 10.052734 17.523438 L 12.005859 38.945312 L 12.052734 39.462891 L 12.501953 39.720703 L 24.501953 46.646484 L 25.001953 46.933594 L 25.501953 46.646484 L 37.501953 39.722656 L 37.949219 39.462891 L 37.996094 38.947266 L 39.949219 17.523438 L 41.501953 16.628906 L 42 16.339844 L 42 15.761719 L 42 13.453125 L 42 12.876953 L 41.5 12.587891 L 25.5 3.3496094 L 25 3.0605469 z" />
                                </svg>
                            </Link>
                        </div>
                    )}
                    <img src={assetUrl(postInfo.cover)} alt={postInfo.title} />
                </div>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: safeContent }} />
        </div>
    );
}
