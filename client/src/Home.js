import React, { useEffect, useState } from 'react'
import Post from './Post'

export default function Home() {
  const [posts,setPosts] = useState([])
  useEffect(() => {
    fetch(`http://localhost:4000/post`, {
      method: 'GET',
      credentials: 'include',
    }).then(res => {
      res.json().then(posts => {
        setPosts(posts)
      })
    })
  },[])
  return (
    <>
      
      {posts.length > 0 && posts.map(post => {
      return  <Post {...post} />
         })}
      </>
  )
}
