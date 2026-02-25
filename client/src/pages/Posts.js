import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { apiFetch } from '../utils/api';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch('/post', { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load posts.');
                return res.json();
            })
            .then(posts => setPosts(posts))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Layout />
            {loading && <Spinner fullPage />}
            {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}
            {!loading && !error && (
                posts.length > 0
                    ? posts.map(post => <Post key={post._id} {...post} />)
                    : <p style={{ textAlign: 'center', padding: '40px' }}>No posts to display yet.</p>
            )}
        </>
    );
}
