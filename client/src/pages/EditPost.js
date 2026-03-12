import { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Editor from '../components/Editor';
import { apiFetch, apiUpload } from '../utils/api';
import '../styles/App.css';
import '../styles/Form.css';
import '../styles/Home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    apiFetch(`/post/${id}`)
      .then(res => res.json())
      .then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    setIsUpdating(true);
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) data.set('file', files[0]);

    await apiUpload('/post', { method: 'PUT', body: data });
    MySwal.fire({ title: 'Success!', text: 'Your post has been updated.', icon: 'success' });
    setRedirect(true);
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
      confirmButtonColor: '#0505A9',
    }).then(result => {
      if (result.isConfirmed && result.value) improveContent(result.value);
    });
  }

  if (redirect) return <Navigate to={`/post/${id}`} />;

  return (
    <>
      <Layout />
      <div className="form-container form-container--wide">
        <h1>Edit Post</h1>
        <p className="subtitle">Update your post content below over the existing draft.</p>

        <form onSubmit={updatePost} encType="multipart/form-data">
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              className="form-input"
              required
              value={title}
              onChange={ev => setTitle(ev.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Summary</label>
            <input
              type="text"
              className="form-input"
              required
              value={summary}
              onChange={ev => setSummary(ev.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Cover Image (Leave blank to keep existing)</label>
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
            <button type="submit" className="btn btn--primary" disabled={isUpdating} style={{ maxWidth: '200px' }}>
              {isUpdating ? 'Saving Changes...' : 'Save Draft'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
