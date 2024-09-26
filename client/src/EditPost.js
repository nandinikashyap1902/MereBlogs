import { useState,useEffect } from "react"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Editor from "./Editor"
import { useParams,Navigate } from "react-router-dom"
export default function EditPost() {
    const {id} = useParams()
    const[title,setTitle] = useState('')
    const[summary,setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect,setRedirect] = useState(false)
    useEffect(() => {
        fetch('http://localhost:4000/post/' + id).then(res => {
          
            res.json().then(postInfo => {
                console.log(postInfo)
                setTitle(postInfo.title)
                setContent(postInfo.content)
                setSummary(postInfo.summary)
           })
        })
            
        
    },[])
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
    const response=  await fetch('http://localhost:4000/post', {
          method: 'PUT',
        body: data,
          credentials:'include'
      })
      if (response.ok) {
          console.log(response.json())
      }
     // setRedirect(true)
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
        <form onSubmit={updatePost} enctype="multipart/form-data">
        <input type="title" placeholder='Title' value={title}
            onChange={ev=>setTitle(ev.target.value)} />
        <input type="summary" placeholder='Summary' value={summary} onChange={ev=>setSummary(ev.target.value)}/>
        <input type="file" onChange={ev=>setFiles(ev.target.files)}/>
            <Editor value={content} onChange={setContent} formats={formats} />
        <button style={{marginTop:'5px'}}>Update Post</button>
 </form>
    )
}