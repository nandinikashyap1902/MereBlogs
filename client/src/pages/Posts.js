import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Layout from '../components/Layout';
import { SkeletonList } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { apiFetch } from '../utils/api';
import '../styles/Pagination.css';
import '../styles/Skeleton.css';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        apiFetch(`/post?page=${page}&limit=10`, { method: 'GET' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load posts.');
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
            {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}

            {loading && <SkeletonList count={4} />}

            {!loading && !error && (
                <>
                    {posts.length > 0
                        ? posts.map(post => <Post key={post._id} {...post} />)
                        : <p style={{ textAlign: 'center', padding: '40px' }}>No posts to display yet.</p>
                    }
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </>
    );
}
