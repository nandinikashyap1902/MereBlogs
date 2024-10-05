import React, { useEffect, useState } from 'react'
import Post from './Post'
import background from './assets/background.json'
import Lottie from 'lottie-react';
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
      {/* <Lottie animationData={background}></Lottie> */}
      {posts.length > 0 && posts.map(post => {
      return  <Post {...post} />
         })}
      </>
  )
}
