import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { formatDistanceToNow } from 'date-fns';
import { assetUrl } from '../utils/api';
import '../styles/PostCard.css';

export default function Post({ _id, title, summary, cover, content, author, createdAt, likes, views, likeCount }) {
  const plainText = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
  const shortContent = plainText.slice(0, 140) + (plainText.length > 140 ? '...' : '');
  const displayLikes = likeCount ?? (likes ? likes.length : 0);
  const displayViews = views ?? 0;

  // Author display — could be a populated object or a plain string
  const authorName = typeof author === 'object' && author?.username
    ? author.username.split('@')[0]
    : (typeof author === 'string' ? author.split('@')[0] : 'Unknown');

  const avatarLetter = authorName[0]?.toUpperCase() ?? '?';

  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : '';

  return (
    <article className="post-card">
      {/* Cover image */}
      <Link to={`/post/${_id}`} className="post-card__cover-link">
        <div className="post-card__cover">
          <img src={assetUrl(cover)} alt={title} loading="lazy" className="post-card__img" />
          <div className="post-card__cover-overlay" />
        </div>
      </Link>

      {/* Body */}
      <div className="post-card__body">
        {/* Author row */}
        <div className="post-card__author">
          <div className="post-card__avatar">{avatarLetter}</div>
          <div className="post-card__author-info">
            <span className="post-card__author-name">@{authorName}</span>
            {timeAgo && <span className="post-card__time">{timeAgo}</span>}
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${_id}`} className="post-card__title-link">
          <h2 className="post-card__title">{title}</h2>
        </Link>

        {/* Summary */}
        <p className="post-card__summary">{summary}</p>

        {/* Preview snippet */}
        <p className="post-card__preview">{shortContent}</p>

        {/* Footer: meta + read more */}
        <div className="post-card__footer">
          <div className="post-card__meta">
            {/* Likes */}
            <span className="post-card__meta-item post-card__meta-item--likes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#e91e63">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {displayLikes}
            </span>

            {/* Views */}
            <span className="post-card__meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {displayViews}
            </span>
          </div>

          <Link to={`/post/${_id}`} className="post-card__read-more">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
