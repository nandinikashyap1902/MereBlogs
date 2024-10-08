import { useState,useEffect,useContext } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import './App.css'
import { formatISO9075 } from "date-fns"
import { UserContext } from "./UserContext"
export function PostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const [redirect, setRedirect] = useState(false)
    const { id } = useParams()
    const { userInfo } = useContext(UserContext)
    useEffect(() => {
        fetch(`${process.env.apiUrl}/${id}`)
            .then(res => {
                res.json().then(postinfo => {
                setPostInfo(postinfo)
            })
        })
    },[] )
    if (!postInfo) return ''
  async  function deletePost() {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        const response = await fetch(`${process.env.apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include' 
        });
        if (response.ok) {
           alert('deleted succesfully') // Redirect to homepage or another route after deletion
        } else {
            alert('Failed to delete the post');
        }
        setRedirect(true)
}
    }
    if (redirect) {
        return (
            <Navigate to="/posts" />
        )
    }
    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            <div className="post-page">
                <div className="image">
                    {userInfo.id === postInfo.author._id && (
                        <div className="edit-row">
                            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

                                Edit this post</Link>
                           </div> 
                        
                    )}
                    
                        <button onClick={deletePost}>Delete</button>
                    
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
                </div>
            </div>
            
            <div className="content"dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
    </div>
  )  
}