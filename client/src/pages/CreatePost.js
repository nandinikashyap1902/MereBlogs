import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Editor from '../components/Editor';
import { apiFetch, apiUpload } from '../utils/api';
import '../styles/App.css';
import '../styles/Form.css';
import '../styles/Home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function CreatePost() {
  const location = useLocation();
  const state = location.state || {};

  const [title, setTitle] = useState(state.title || '');
  const [summary, setSummary] = useState(state.summary || '');
  const [content, setContent] = useState(state.content || '');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    if (!title || !summary || !content) {
      MySwal.fire('Required fields', 'Title, summary, and content are required.', 'error');
      return;
    }

    setIsPublishing(true);
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files?.[0]) data.set('file', files[0]);

    const response = await apiUpload('/post', { method: 'POST', body: data });
    if (response.ok) {
      MySwal.fire({ title: 'Success!', text: 'Your post has been published.', icon: 'success' });
      setRedirect(true);
    } else {
      const err = await response.json().catch(() => ({}));
      MySwal.fire('Error!', err.message || 'Failed to create post.', 'error');
    }
    setIsPublishing(false);
  }

  async function improveContent(instruction) {
    if (!content || content.length < 10) {
      MySwal.fire('Error', 'Content is too short to improve.', 'error');
      return;
    }
    MySwal.fire({ title: 'Improving via Gemini AI...', didOpen: () => MySwal.showLoading() });
    try {
      const res = await apiFetch('/improve-blog', { method: 'POST', body: JSON.stringify({ content, instruction }) });
      if (!res.ok) throw new Error('Failed to improve content');
      const data = await res.json();
      setContent(data.content);
      MySwal.fire('Success', 'Content improved successfully!', 'success');
    } catch (err) {
      MySwal.fire('Error', err.message, 'error');
    }
  }

  function showImproveOptions(ev) {
    ev.preventDefault();
    MySwal.fire({
      title: 'AI Blog Assistant',
      text: 'How should the AI rewrite your draft?',
      input: 'select',
      inputOptions: {
        'Make it more professional': 'Make it more professional',
        'Simplify for beginners': 'Simplify for beginners',
        'Fix grammar and spelling': 'Fix grammar and spelling',
        'Shorten': 'Shorten it',
        'Expand': 'Expand on the ideas',
      },
      inputPlaceholder: 'Select an AI action...',
      showCancelButton: true,
      confirmButtonText: 'Improve Draft',
      confirmButtonColor: '#6c63ff',
    }).then(result => {
      if (result.isConfirmed && result.value) improveContent(result.value);
    });
  }

  if (redirect) return <Navigate to="/posts" />;

  return (
    <>
      <Layout />
      <div className="form-container form-container--wide">
        <h1>Write a Post</h1>
        <p className="subtitle">Share your insights, story, or project with the world.</p>

        <form onSubmit={createNewPost} encType="multipart/form-data">
          
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Give your post a compelling title"
              required
              value={title}
              onChange={ev => setTitle(ev.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Summary (Snippet)</label>
            <input
              type="text"
              className="form-input"
              placeholder="A short, catchy summary that appears on post cards"
              required
              value={summary}
              onChange={ev => setSummary(ev.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <input
              type="file"
              className="form-file-input"
              onChange={ev => setFiles(ev.target.files)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Content Body</label>
              <button onClick={showImproveOptions} type="button" className="btn btn--ghost" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}>
                ✨ AI Improve
              </button>
            </div>
            
            <Editor value={content} onChange={setContent} />
          </div>

          <div className="form-actions" style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 0 }}>
            <button type="submit" className="btn btn--primary" disabled={isPublishing} style={{ maxWidth: '200px' }}>
              {isPublishing ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
