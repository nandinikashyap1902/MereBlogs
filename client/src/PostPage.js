import { useState,useEffect,useContext } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import './App.css'
import { formatISO9075 } from "date-fns"
import { UserContext } from "./UserContext"
import Swal from 'sweetalert2'

export function PostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const [redirect, setRedirect] = useState(false)
    const { id } = useParams()
    const { userInfo } = useContext(UserContext)
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post/${id}`)
            .then(res => {
                res.json().then(postinfo => {
                setPostInfo(postinfo)
            })
        })
    },[id] )
    if (!postInfo) return ''
    async function deletePost() {
        
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            }).then((result) => {
              if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_URL}/post/${id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include'
                })
                  .then(response => {
                    if (response.ok) {
                      return response.json().then(() => {
                        Swal.fire({
                          title: 'Deleted!',
                          text: 'Your post has been deleted successfully.',
                          icon: 'success',
                          confirmButtonText: 'OK'
                        });
                        setRedirect(true);
                      });
                    } else {
                      Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete the post.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      });
                    }
                  })
                  .catch(error => {
                    Swal.fire({
                      title: 'Error!',
                      text: 'An error occurred while deleting the post.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                    });
                  });
              }
            });
          
          
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

                            </Link>
                           
                            <Link onClick={deletePost} className="delete-btn">
                            
                     <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="100" viewBox="0 0 50 50" >
<path d="M 25 3.0605469 L 24.5 3.3496094 L 8.5 12.587891 L 8 12.876953 L 8 13.453125 L 8 15.761719 L 8 16.339844 L 8.5019531 16.628906 L 10.052734 17.523438 L 12.005859 38.945312 L 12.052734 39.462891 L 12.501953 39.720703 L 24.501953 46.646484 L 25.001953 46.933594 L 25.501953 46.646484 L 37.501953 39.722656 L 37.949219 39.462891 L 37.996094 38.947266 L 39.949219 17.523438 L 41.501953 16.628906 L 42 16.339844 L 42 15.761719 L 42 13.453125 L 42 12.876953 L 41.5 12.587891 L 25.5 3.3496094 L 25 3.0605469 z M 25 4.5039062 L 36.5 11.144531 L 25 17.783203 L 13.5 11.144531 L 25 4.5039062 z M 23.982422 6.8476562 A 0.250025 0.250025 0 0 0 23.876953 6.8808594 L 21.908203 8.015625 A 0.250025 0.250025 0 0 0 21.75 8.296875 L 21.751953 10.5625 A 0.250025 0.250025 0 0 0 21.876953 10.779297 L 25.845703 13.070312 A 0.250025 0.250025 0 0 0 26.154297 13.072266 L 28.126953 11.931641 A 0.250025 0.250025 0 0 0 28.251953 11.716797 L 28.25 9.4824219 A 0.250025 0.250025 0 0 0 28.054688 9.1503906 L 24.126953 6.8808594 A 0.250025 0.250025 0 0 0 24.007812 6.8476562 A 0.250025 0.250025 0 0 0 23.982422 6.8476562 z M 24 7.3867188 L 27.501953 9.40625 L 26 10.273438 L 22.5 8.2519531 L 24 7.3867188 z M 22.25 8.6855469 L 25.75 10.707031 L 25.751953 12.439453 L 22.251953 10.417969 L 22.25 8.6855469 z M 27.75 9.8398438 L 27.75 11.572266 L 26.251953 12.4375 L 26.25 10.707031 L 27.75 9.8398438 z M 12.75 11.576172 L 12.75 13.453125 A 0.250025 0.250025 0 0 0 12.875 13.669922 L 24.841797 20.578125 A 0.250025 0.250025 0 0 0 24.84375 20.580078 A 0.250025 0.250025 0 0 0 25.144531 20.587891 A 0.250025 0.250025 0 0 0 25.164062 20.574219 L 37.125 13.669922 A 0.250025 0.250025 0 0 0 37.25 13.453125 L 37.25 11.576172 L 40.5 13.453125 L 25 22.402344 L 9.5 13.453125 L 12.75 11.576172 z M 13.25 11.578125 L 24.75 18.216797 L 24.75 19.947266 L 13.25 13.308594 L 13.25 11.578125 z M 36.75 11.578125 L 36.75 13.308594 L 25.25 19.947266 L 25.25 18.216797 L 36.75 11.578125 z M 9.25 13.886719 L 24.75 22.835938 L 24.75 24.564453 L 11.136719 16.707031 A 0.250025 0.250025 0 0 0 11.125 16.699219 A 0.250025 0.250025 0 0 0 11.103516 16.6875 L 9.25 15.617188 L 9.25 13.886719 z M 40.75 13.886719 L 40.75 15.617188 L 38.90625 16.681641 A 0.250025 0.250025 0 0 0 38.875 16.699219 A 0.250025 0.250025 0 0 0 38.853516 16.712891 L 25.25 24.564453 L 25.25 22.835938 L 40.75 13.886719 z M 11.291016 17.371094 L 24.75 25.140625 L 24.75 45.347656 L 13.236328 38.703125 L 11.291016 17.371094 z M 38.708984 17.371094 L 36.763672 38.705078 L 25.25 45.347656 L 25.25 25.140625 L 38.708984 17.371094 z M 14.980469 24.75 A 0.250025 0.250025 0 0 0 14.75 25.013672 L 15.248047 34.537109 A 0.250025 0.250025 0 0 0 15.373047 34.742188 L 17.373047 35.896484 A 0.250025 0.250025 0 0 0 17.748047 35.666016 L 17.25 26.142578 A 0.250025 0.250025 0 0 0 17.125 25.939453 L 15.125 24.783203 A 0.250025 0.250025 0 0 0 14.980469 24.75 z M 15.273438 25.447266 L 16.757812 26.302734 L 17.224609 35.232422 L 15.740234 34.376953 L 15.273438 25.447266 z M 19.980469 27.636719 A 0.250025 0.250025 0 0 0 19.75 27.886719 L 19.75 37.123047 A 0.250025 0.250025 0 0 0 19.875 37.339844 L 21.876953 38.496094 A 0.250025 0.250025 0 0 0 22.251953 38.279297 L 22.25 29.041016 A 0.250025 0.250025 0 0 0 22.125 28.824219 L 20.125 27.669922 A 0.250025 0.250025 0 0 0 20.005859 27.636719 A 0.250025 0.250025 0 0 0 19.980469 27.636719 z M 20.25 28.320312 L 21.75 29.185547 L 21.751953 37.845703 L 20.25 36.980469 L 20.25 28.320312 z"></path>
</svg>
</Link>                     
                           </div> 
                        
                    )}
                    
                       
                    
                       
                    <img src={`${process.env.REACT_APP_API_URL}/${postInfo.cover}`} alt=""/>
                </div>
            </div>
            
            <div className="content"dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
    </div>
  )  
}