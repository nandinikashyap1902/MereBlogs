import { useState,useEffect } from "react"
import 'react-quill/dist/quill.snow.css'
import Editor from "./Editor"
import { useParams, Navigate } from "react-router-dom"
import './App.css'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export default function EditPost() {
    const {id} = useParams()
    const[title,setTitle] = useState('')
    const[summary,setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect,setRedirect] = useState(false)
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post/` + id).then(res => {
          
            res.json().then(postInfo => {
                console.log(postInfo)
                setTitle(postInfo.title)
                setContent(postInfo.content)
                setSummary(postInfo.summary)
           })
        })
            
        
    },[id])
  async  function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData()
        data.set('title',title)
        data.set('summary',summary)
      data.set('content', content)
      data.set('id',id)
        if (files?.[0]) {
            data.set('file', files?.[0])
        }
     await fetch(`${process.env.REACT_APP_API_URL}/post`, {
          method: 'PUT',
        body: data,
          credentials:'include'
      })
      MySwal.fire({
        title: 'Success!',
        text: 'Your post has been updated.',
        icon: 'success',
        confirmButtonText: 'OK'
       })
      setRedirect(true)
    }
    
    if (redirect) {
        return <Navigate to={'/post/'+id} />
    }
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]
    return (
//         <form onSubmit={updatePost} encType="multipart/form-data">
//         <input type="title" placeholder='Title' value={title}
//             onChange={ev=>setTitle(ev.target.value)} />
//         <input type="summary" placeholder='Summary' value={summary} onChange={ev=>setSummary(ev.target.value)}/>
//         <input type="file" onChange={ev=>setFiles(ev.target.files)}/>
//             <Editor value={content} onChange={setContent} formats={formats} />
//         <button style={{marginTop:'5px'}}>Update Post</button>
        //  </form>
      <div className="center editpost">
        <h1>Edit Post</h1>
<form onSubmit={updatePost} encType="multipart/form-data">
  <div className="inputbox">
    <input type="title" required="required"   value={title}
            onChange={ev=>setTitle(ev.target.value)}/>
    <span>Title</span>
  </div>
  <div className="inputbox">
    <input type="summary" required="required" value={summary} onChange={ev=>setSummary(ev.target.value)}/>
    <span>summary</span>
        </div>
        <div className="inputbox">
    <input type="file"  value={files} onChange={ev=>setFiles(ev.target.files)}/>
    <span>files</span>
        </div>
        <Editor value={content} onChange={setContent} formats={formats} />
  <div class="buttons">
<button class="blob-btn" style={{marginTop: '20px',
  marginLeft: '0'}}>
Edit
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
    )
}

