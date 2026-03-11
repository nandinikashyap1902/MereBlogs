import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { SkeletonList } from '../components/Skeleton';
import { apiFetch } from '../utils/api';
import '../styles/Skeleton.css';
import '../styles/PostCard.css';

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/saved')
      .then(res => { if (!res.ok) throw new Error('Failed to load saved posts.'); return res.json(); })
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Layout />
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '16px 20px 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
          🔖 Saved Posts
        </h2>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0' }}>
          Posts you've bookmarked to read later
        </p>
      </div>

      {loading && <SkeletonList count={4} />}
      {error && <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px' }}>{error}</p>}

      {!loading && !error && (
        posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map(post => <Post key={post._id} {...post} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔖</p>
            <p style={{ color: '#888', fontWeight: 600 }}>No saved posts yet.</p>
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Hit the <strong>Save</strong> button on any post to bookmark it here.
            </p>
          </div>
        )
      )}
    </>
  );
}
