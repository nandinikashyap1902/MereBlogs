import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Layout from '../components/Layout';
import { apiFetch } from '../utils/api';

export default function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        apiFetch('/post', { method: 'GET' })
            .then(res => res.json())
            .then(posts => setPosts(posts));
    }, []);

    return (
        <>
            <Layout />
            {posts.length > 0
                ? posts.map(post => <Post key={post._id} {...post} />)
                : <p style={{ textAlign: 'center' }}>No posts to display</p>
            }
        </>
    );
}
