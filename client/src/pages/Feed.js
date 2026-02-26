import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import { apiFetch } from '../utils/api';
import '../styles/Pagination.css';

/**
 * Feed — public page showing all posts from all users, paginated.
 * No login required.
 */
export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        apiFetch(`/feed?page=${page}&limit=10`, { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load feed.');
                return res.json();
            })
            .then(data => {
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <>
            <Layout />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '10px' }}>
                <h2 style={{ textAlign: 'center', margin: '20px 0', color: '#0505A9' }}>
                    📰 Public Feed
                </h2>

                {loading && <Spinner fullPage />}
                {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}

                {!loading && !error && (
                    <>
                        {posts.length > 0
                            ? posts.map(post => <Post key={post._id} {...post} />)
                            : <p style={{ textAlign: 'center', padding: '40px' }}>No posts yet. Be the first to write one!</p>
                        }
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </>
    );
}
