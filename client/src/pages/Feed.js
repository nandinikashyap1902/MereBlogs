import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Layout from '../components/Layout';
import { SkeletonList } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { apiFetch } from '../utils/api';
import '../styles/Pagination.css';
import '../styles/Skeleton.css';

const SORT_OPTIONS = [
    { key: 'newest', label: '🕐 Newest' },
    { key: 'popular', label: '👁 Most Viewed' },
    { key: 'trending', label: '❤️ Trending' },
];

/**
 * Feed — public page showing all posts from all users, paginated + sortable.
 */
export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        setLoading(true);
        setError(null);
        apiFetch(`/feed?page=${page}&limit=10&sort=${sort}`, { method: 'GET' })
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
    }, [page, sort]);

    function handleSortChange(newSort) {
        if (newSort !== sort) {
            setSort(newSort);
            setPage(1); // reset to page 1 on sort change
        }
    }

    return (
        <>
            <Layout />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '10px' }}>
                <h2 style={{ textAlign: 'center', margin: '20px 0', color: '#0505A9' }}>
                    📰 Public Feed
                </h2>

                {/* Sort bar */}
                <div className="sort-bar">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.key}
                            className={`sort-bar__btn ${sort === opt.key ? 'sort-bar__btn--active' : ''}`}
                            onClick={() => handleSortChange(opt.key)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}

                {loading && <SkeletonList count={4} />}

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
