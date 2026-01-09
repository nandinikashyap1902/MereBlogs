import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { Navigate, useLocation } from 'react-router-dom'
import Editor from './Editor'
import './App.css'
import './Form.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export default function CreatePost() {
  const location = useLocation();
  const state = location.state || {}; // Access state passed from BlogGenerator

  const [title, setTitle] = useState(state.title || '')
  const [summary, setSummary] = useState(state.summary || '')
  const [content, setContent] = useState(state.content || '')
  const [files, setFiles] = useState('')
  const [redirect, setRedirect] = useState(false)

  //  const formats = [
  //       'header',
  //       'bold', 'italic', 'underline', 'strike', 'blockquote',
  //       'list', 'bullet', 'indent',
  //       'link', 'image'
  //   ]
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('file', files[0])
    ev.preventDefault()

    const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
      method: 'POST',
      body: data,
      credentials: 'include'
    })
    MySwal.fire({
      title: 'Success!',
      text: 'Your post has been created.',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    if (response.ok) {
      setRedirect(true)
    }

  }

  async function improveContent(instruction) {
    if (!content || content.length < 10) {
      MySwal.fire('Error', 'Content is too short to improve.', 'error');
      return;
    }
    MySwal.fire({
      title: 'Improving...',
      didOpen: () => {
        MySwal.showLoading()
      }
    });
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/improve-blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, instruction })
      });
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
        'Expand': 'Expand on the ideas'
      },
      inputPlaceholder: 'Select an improvement...',
      showCancelButton: true,
      confirmButtonText: 'Improve',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        improveContent(result.value);
      }
    });
  }
  if (redirect) {
    return <Navigate to={'/posts'} />
  }
  return (<>

    <div className="center createpost" >
      <h1>CREATE A NEW POST</h1>
      <form onSubmit={createNewPost} encType="multipart/form-data">
        <div className="inputbox">
          <input type="text" value={title}
            onChange={ev => setTitle(ev.target.value)} />
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
          <button onClick={showImproveOptions} className="blob-btn" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>
            AI Improve
            <span className="blob-btn__inner">
              <span className="blob-btn__blobs">
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
              </span>
            </span>
          </button>
        </div>



        <div class="buttons btn">
          <button class="blob-btn">
            Post
            <span class="blob-btn__inner">
              <span class="blob-btn__blobs">
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
                <span class="blob-btn__blob"></span>
              </span>
            </span>
          </button>
          <br />

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
                <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
              </filter>
            </defs>
          </svg>
        </div>
      </form>
    </div>
  </>
  )
}
