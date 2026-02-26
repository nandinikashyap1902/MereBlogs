import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useLocation } from 'react-router-dom';
import Editor from '../components/Editor';
import BlobButton from '../components/BlobButton';
import { apiFetch, apiUpload } from '../utils/api';
import '../styles/App.css';
import '../styles/Form.css';
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

    async function createNewPost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        const response = await apiUpload('/post', { method: 'POST', body: data });
        if (response.ok) {
            MySwal.fire({ title: 'Success!', text: 'Your post has been created.', icon: 'success', confirmButtonText: 'OK' });
            setRedirect(true);
        } else {
            const err = await response.json().catch(() => ({}));
            MySwal.fire('Error!', err.message || 'Failed to create post.', 'error');
        }
    }

    async function improveContent(instruction) {
        if (!content || content.length < 10) {
            MySwal.fire('Error', 'Content is too short to improve.', 'error');
            return;
        }
        MySwal.fire({ title: 'Improving...', didOpen: () => MySwal.showLoading() });
        try {
            const res = await apiFetch('/improve-blog', { method: 'POST', body: JSON.stringify({ content, instruction }) });
            if (!res.ok) throw new Error('Failed to improve content');
            const data = await res.json();
            setContent(data.content);
            MySwal.fire('Success', 'Content improved!', 'success');
        } catch (err) {
            MySwal.fire('Error', err.message, 'error');
        }
    }

    function showImproveOptions(ev) {
        ev.preventDefault();
        MySwal.fire({
            title: 'AI Blog Improver',
            input: 'select',
            inputOptions: {
                'Make it more professional': 'Make it more professional',
                'Simplify for beginners': 'Simplify for beginners',
                'Fix grammar and spelling': 'Fix grammar and spelling',
                'Shorten': 'Shorten it',
                'Expand': 'Expand on the ideas',
            },
            inputPlaceholder: 'Select an improvement...',
            showCancelButton: true,
            confirmButtonText: 'Improve',
        }).then(result => {
            if (result.isConfirmed && result.value) improveContent(result.value);
        });
    }

    if (redirect) return <Navigate to="/posts" />;

    return (
        <div className="center createpost">
            <h1>CREATE A NEW POST</h1>
            <form onSubmit={createNewPost} encType="multipart/form-data">
                <div className="inputbox">
                    <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} />
                    <span>title</span>
                </div>
                <div className="inputbox">
                    <input type="text" value={summary} onChange={ev => setSummary(ev.target.value)} />
                    <span>summary</span>
                </div>
                <div className="inputbox">
                    <input type="file" onChange={ev => setFiles(ev.target.files)} />
                    <span>file</span>
                </div>

                <Editor value={content} onChange={setContent} />

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <BlobButton onClick={showImproveOptions} style={{ padding: '5px 15px', fontSize: '0.8rem' }}>
                        AI Improve
                    </BlobButton>
                </div>

                <BlobButton type="submit" className="btn">Post</BlobButton>
            </form>
        </div>
    );
}
