import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from '../components/Post';
import Layout from '../components/Layout';
import { SkeletonList } from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { apiFetch } from '../utils/api';
import '../styles/Pagination.css';
import '../styles/Skeleton.css';
import '../styles/PostCard.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { setPage(1); }, [query]);

  useEffect(() => {
    if (!query.trim()) { setPosts([]); setLoading(false); return; }
    setLoading(true);
    setError(null);
    apiFetch(`/search?q=${encodeURIComponent(query)}&page=${page}&limit=12`)
      .then(res => { if (!res.ok) throw new Error('Search failed.'); return res.json(); })
      .then(data => { setPosts(data.posts); setTotalPages(data.totalPages); setTotal(data.total); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, page]);

  return (
    <>
      <Layout />
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '16px 20px 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
          🔍 "{query}"
        </h2>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>
          {loading ? 'Searching...' : `${total} ${total === 1 ? 'result' : 'results'} found`}
        </p>
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
            <p style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
              No posts match "{query}". Try different keywords.
            </p>
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </>
  );
}
