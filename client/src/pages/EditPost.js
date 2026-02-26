import { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useParams, Navigate } from 'react-router-dom';
import Editor from '../components/Editor';
import BlobButton from '../components/BlobButton';
import { apiFetch, apiUpload } from '../utils/api';
import '../styles/App.css';
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
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) data.set('file', files[0]);

        await apiUpload('/post', { method: 'PUT', body: data });
        MySwal.fire({ title: 'Success!', text: 'Your post has been updated.', icon: 'success', confirmButtonText: 'OK' });
        setRedirect(true);
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

    if (redirect) return <Navigate to={`/post/${id}`} />;

    return (
        <div className="center editpost">
            <h1>Edit Post</h1>
            <form onSubmit={updatePost} encType="multipart/form-data">
                <div className="inputbox">
                    <input type="text" required value={title} onChange={ev => setTitle(ev.target.value)} />
                    <span>Title</span>
                </div>
                <div className="inputbox">
                    <input type="text" required value={summary} onChange={ev => setSummary(ev.target.value)} />
                    <span>summary</span>
                </div>
                <div className="inputbox">
                    <input type="file" onChange={ev => setFiles(ev.target.files)} />
                    <span>files</span>
                </div>

                <Editor value={content} onChange={setContent} />

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <BlobButton onClick={showImproveOptions} style={{ padding: '5px 15px', fontSize: '0.8rem' }}>
                        AI Improve
                    </BlobButton>
                </div>

                <BlobButton type="submit" style={{ marginTop: '20px' }}>Edit</BlobButton>
            </form>
        </div>
    );
}
