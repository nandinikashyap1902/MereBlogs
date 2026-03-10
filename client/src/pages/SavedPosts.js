import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { SkeletonList } from '../components/Skeleton';
import { apiFetch } from '../utils/api';
import '../styles/Skeleton.css';

/**
 * SavedPosts — shows all posts the logged-in user has bookmarked.
 * Protected route (only accessible when logged in).
 */
export default function SavedPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch('/saved')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load saved posts.');
                return res.json();
            })
            .then(data => setPosts(Array.isArray(data) ? data : []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Layout />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '10px' }}>
                <h2 style={{ textAlign: 'center', margin: '24px 0 8px', color: '#0505A9' }}>
                    🔖 Saved Posts
                </h2>
                <p style={{ textAlign: 'center', color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Posts you've bookmarked to read later
                </p>

                {loading && <SkeletonList count={3} />}
                {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}

                {!loading && !error && (
                    posts.length > 0
                        ? posts.map(post => <Post key={post._id} {...post} />)
                        : (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🔖</p>
                                <p style={{ color: '#888' }}>No saved posts yet.</p>
                                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                    Hit the <strong>Save</strong> button on any post to bookmark it here.
                                </p>
                            </div>
                        )
                )}
            </div>
        </>
    );
}
