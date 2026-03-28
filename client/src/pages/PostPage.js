import { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import DOMPurify from 'dompurify';
import { UserContext } from '../context/UserContext';
import { apiFetch, assetUrl } from '../utils/api';
import { PostPageSkeleton } from '../components/Skeleton';
import Comments from '../components/Comments';
import Swal from 'sweetalert2';
import '../styles/PostPage.css';
import '../styles/Skeleton.css';
import '../styles/Comments.css';
export function PostPage() {
  const [postInfo, setPostInfo]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [redirect, setRedirect]       = useState(false);
  const [likeCount, setLikeCount]     = useState(0);
  const [isLiked, setIsLiked]         = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isSaved, setIsSaved]         = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [copied, setCopied]           = useState(false);

  const { id }       = useParams();
  const { userInfo } = useContext(UserContext);

  /* ── Fetch post ─────────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    apiFetch(`/post/${id}`)
      .then(res => { if (!res.ok) throw new Error('Post not found.'); return res.json(); })
      .then(p => {
        setPostInfo(p);
        setLikeCount(p.likeCount ?? (p.likes ? p.likes.length : 0));
        if (userInfo?.id && p.likes) setIsLiked(p.likes.includes(userInfo.id));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, userInfo?.id]);

  /* ── Check saved ────────────────────────────────────────────── */
  useEffect(() => {
    if (!userInfo?.id) return;
    apiFetch(`/saved/check/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setIsSaved(d.saved); });
  }, [id, userInfo?.id]);

  /* ── Actions ────────────────────────────────────────────────── */
  async function toggleLike() {
    if (!userInfo?.id) { Swal.fire('Login required', 'Please log in to like posts.', 'info'); return; }
    setLikeLoading(true);
    try {
      const res = await apiFetch(`/post/${id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setLikeCount(d.likeCount); setIsLiked(d.isLiked);
    } catch { Swal.fire('Error', 'Could not update like.', 'error'); }
    finally { setLikeLoading(false); }
  }

  async function toggleSave() {
    if (!userInfo?.id) { Swal.fire('Login required', 'Please log in to save posts.', 'info'); return; }
    setSaveLoading(true);
    try {
      const res = await apiFetch(`/post/${id}/save`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const d = await res.json(); setIsSaved(d.saved);
    } catch { Swal.fire('Error', 'Could not update save.', 'error'); }
    finally { setSaveLoading(false); }
  }

  function sharePost() {
    const url = window.location.href;
    if (navigator.share) { navigator.share({ title: postInfo?.title, url }); }
    else { navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); }
  }

  async function deletePost() {
    const result = await Swal.fire({
      title: 'Delete this post?', text: "This can't be undone.", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#e53935', cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it',
    });
    if (!result.isConfirmed) return;
    const res = await apiFetch(`/post/${id}`, { method: 'DELETE' });
    if (res.ok) { Swal.fire('Deleted!', 'Post removed.', 'success'); setRedirect(true); }
    else Swal.fire('Error', 'Failed to delete.', 'error');
  }

  if (redirect)  return <Navigate to="/posts" />;
  if (loading)   return <PostPageSkeleton />;
  if (error)     return (
    <div className="pp-error">
      <span>😕</span>
      <p>{error}</p>
      <Link to="/feed" className="pp-error__link">← Back to Feed</Link>
    </div>
  );
  if (!postInfo) return null;

  const safeContent  = DOMPurify.sanitize(postInfo.content);
  const authorName   = postInfo.author?.username?.split('@')[0] ?? 'Unknown';
  const avatarLetter = authorName[0]?.toUpperCase() ?? '?';
  const isAuthor     = userInfo?.id === postInfo.author?._id;
  const readingMins  = Math.max(1, Math.ceil((DOMPurify.sanitize(postInfo.content, { ALLOWED_TAGS: [] })).split(' ').length / 200));

  return (
    <article className="pp">

      {/* ── Hero cover image ──────────────────────────────────── */}
      <div className="pp__hero">
        <img src={assetUrl(postInfo.cover)} alt={postInfo.title} className="pp__hero-img" />
        <div className="pp__hero-overlay" />

        {/* Floating title block */}
        <div className="pp__hero-text">
          <h1 className="pp__title">{postInfo.title}</h1>
          {postInfo.summary && <p className="pp__summary">{postInfo.summary}</p>}
        </div>
      </div>

      {/* ── Article shell ─────────────────────────────────────── */}
      <div className="pp__shell">

        {/* ── Meta bar ── */}
        <div className="pp__meta">
          <div className="pp__author">
            <div className="pp__avatar">{avatarLetter}</div>
            <div>
              <span className="pp__author-name">@{authorName}</span>
              <div className="pp__dates">
                <time className="pp__date">
                  {format(new Date(postInfo.createdAt), 'MMM d, yyyy')}
                </time>
                <span className="pp__dot">·</span>
                <span className="pp__reading">{readingMins} min read</span>
              </div>
            </div>
          </div>

          {/* Owner controls */}
          {isAuthor && (
            <div className="pp__owner-actions">
              <Link to={`/edit/${postInfo._id}`} className="pp__ctrl pp__ctrl--edit" title="Edit">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </Link>
              <button onClick={deletePost} className="pp__ctrl pp__ctrl--delete" title="Delete">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Engagement strip ── */}
        <div className="pp__engage">
          {/* Like */}
          <button
            className={`pp__engage-btn pp__engage-btn--like ${isLiked ? 'pp__engage-btn--liked' : ''}`}
            onClick={toggleLike} disabled={likeLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={isLiked ? '#e91e63' : 'none'}
              stroke={isLiked ? '#e91e63' : 'currentColor'} strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          {/* Views */}
          <span className="pp__engage-stat">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {postInfo.views ?? 0} Views
          </span>

          {/* Divider */}
          <div className="pp__engage-divider" />

          {/* Save */}
          <button
            className={`pp__engage-btn ${isSaved ? 'pp__engage-btn--saved' : ''}`}
            onClick={toggleSave} disabled={saveLoading}
            title={isSaved ? 'Remove bookmark' : 'Save for later'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            {isSaved ? 'Saved' : 'Save'}
          </button>

          {/* Share */}
          <button
            className={`pp__engage-btn ${copied ? 'pp__engage-btn--copied' : ''}`}
            onClick={sharePost}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {copied ? '✓ Copied!' : 'Share'}
          </button>
        </div>

        {/* ── Post body content ── */}
        <div
          className="pp__content"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {/* ── Footer author card ── */}
        <div className="pp__author-card">
          <div className="pp__author-card-avatar">{avatarLetter}</div>
          <div>
            <p className="pp__author-card-name">Written by @{authorName}</p>
            <p className="pp__author-card-sub">
              Published {formatDistanceToNow(new Date(postInfo.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* ── Comments ── */}
        <Comments postId={id} />
      </div>
    </article>
  );
}
