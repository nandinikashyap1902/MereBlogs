import { useState,useEffect,useContext } from "react"
import { useParams } from "react-router-dom"

import './App.css'
import { formatISO9075 } from "date-fns"
import { UserContext } from "./UserContext"
export function PostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const { id } = useParams()
    const {userInfo} = useContext(UserContext)
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(res => {
                res.json().then(postInfo => {
                setPostInfo(postInfo)
            })
        })
    }, [])
    if(!postInfo) return ''
    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            <div className="post-page">
                <div className="image">
                    {userInfo.id === postInfo.author._id && (
                        <div className="edit-btn">
                            <a className="edit-btn" href=".">Edit this post</a>
                           </div> 
                        
)}
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
                </div>
            </div>
            
            <div className="content"dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
    </div>
  )  
}