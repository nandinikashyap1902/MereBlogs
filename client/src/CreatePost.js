import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom'
import Editor from './Editor'
import './App.css'
import './Form.css'

export default function CreatePost() {
    const[title,setTitle] = useState('')
    const[summary,setSummary] = useState('')
    const [content, setContent] = useState('')
  const [files, setFiles] = useState('')
  const [redirect,setRedirect] = useState(false)
  
   const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]
   async function createNewPost(ev) {
        const data = new FormData();
        data.set('title',title)
        data.set('summary',summary)
        data.set('content',content)
        data.set('file',files[0])
     ev.preventDefault()
     
    const response=  await fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'POST',
      body: data,
            credentials:'include'
        })
     if (response.ok) {
    setRedirect(true)
     }
     
  }
  if (redirect) {
   return  <Navigate to={'/posts'} />
  }
  return (<>

    <div className="center createpost" >
      <h1>CREATE A NEW POST</h1>
    <form onSubmit={createNewPost} encType="multipart/form-data">
      <div className="inputbox">
        <input type="text"   value={title}
              onChange={ev=>setTitle(ev.target.value)}/>
        <span>title</span>
      </div>
      <div className="inputbox">
        <input type="text" value={summary} onChange={ev => setSummary(ev.target.value)}/>
        <span>summary</span>
        </div>
        <div className="inputbox">
            <input type="file" onChange={ev => setFiles(ev.target.files)} />
            <span>file</span>
        </div>
        
        <Editor value={content} onChange={setContent} />
            
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
  <br/>

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
