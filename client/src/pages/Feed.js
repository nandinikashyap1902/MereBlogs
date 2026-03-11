import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Layout from '../components/Layout';
import { SkeletonList } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { apiFetch } from '../utils/api';
import '../styles/Pagination.css';
import '../styles/Skeleton.css';
import '../styles/PostCard.css';

const SORT_OPTIONS = [
  { key: 'newest',   label: '🕐 Newest' },
  { key: 'popular',  label: '👁 Most Viewed' },
  { key: 'trending', label: '❤️ Trending' },
];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/feed?page=${page}&limit=12&sort=${sort}`, { method: 'GET' })
      .then(res => { if (!res.ok) throw new Error('Failed to load feed.'); return res.json(); })
      .then(data => { setPosts(data.posts); setTotalPages(data.totalPages); setTotal(data.total); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, sort]);

  function handleSortChange(newSort) {
    if (newSort !== sort) { setSort(newSort); setPage(1); }
  }

  return (
    <>
      <Layout />

      {/* Header */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '16px 20px 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
          📰 Public Feed
        </h2>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 12px' }}>
          {total > 0 ? `${total} stories from writers around the world` : 'Stories from writers around the world'}
        </p>

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
      </div>

      {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}
      {loading && <SkeletonList count={6} />}

      {!loading && !error && (
        <>
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => <Post key={post._id} {...post} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', padding: '60px', color: '#888' }}>No posts yet. Be the first!</p>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </>
  );
}
