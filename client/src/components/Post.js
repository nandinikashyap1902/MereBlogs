import React from 'react';
import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/api';
import '../styles/App.css';

export default function Post({ _id, title, summary, cover, content }) {
    const shortContent = content.toString().replaceAll('<p>', '').slice(0, 90) + '....';

    return (
        <>
            <hr />
            <div className="post-div">
                <div className="post">
                    <div className="image">
                        <Link to={`/post/${_id}`}>
                            <img src={assetUrl(cover)} alt={title} />
                        </Link>
                    </div>
                    <div className="texts">
                        <Link to={`/post/${_id}`}>
                            <h2>{title}</h2>
                        </Link>
                        <p className="summary">{summary}</p>
                        <div dangerouslySetInnerHTML={{ __html: shortContent }} />
                    </div>
                </div>
            </div>
        </>
    );
}
