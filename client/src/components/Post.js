import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { assetUrl } from '../utils/api';
import '../styles/App.css';
import '../styles/Skeleton.css';

export default function Post({ _id, title, summary, cover, content, likes, views, likeCount }) {
    const plainText = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    const shortContent = plainText.slice(0, 120) + (plainText.length > 120 ? '...' : '');
    const displayLikes = likeCount ?? (likes ? likes.length : 0);
    const displayViews = views ?? 0;

    return (
        <>
            <hr />
            <div className="post-div">
                <div className="post">
                    <div className="image">
                        <Link to={`/post/${_id}`}>
                            <img src={assetUrl(cover)} alt={title} loading="lazy" />
                        </Link>
                    </div>
                    <div className="texts">
                        <Link to={`/post/${_id}`}>
                            <h2>{title}</h2>
                        </Link>
                        <p className="summary">{summary}</p>
                        <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>{shortContent}</p>

                        {/* Likes + Views meta row */}
                        <div className="post-meta">
                            <span className="post-meta__item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#e91e63" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                {displayLikes}
                            </span>
                            <span className="post-meta__item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                {displayViews}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
