import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { assetUrl } from '../utils/api';
import '../styles/App.css';

export default function Post({ _id, title, summary, cover, content }) {
    // Strip all HTML tags for the preview snippet — no dangerouslySetInnerHTML needed
    const plainText = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    const shortContent = plainText.slice(0, 120) + (plainText.length > 120 ? '...' : '');

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
                        {/* Plain text preview — no HTML rendered, zero XSS surface */}
                        <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5' }}>{shortContent}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
