import React, { useEffect, useState } from 'react'
import Post from './Post'
import Layout from './Layout';

export default function Posts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/user-posts`, {
      method: 'GET',
      credentials: 'include',
    }).then(res => {
      res.json().then(posts => {
        setPosts(posts)
      })
    })
  }, [])
  return (
    <>
      {/* <Lottie animationData={background}></Lottie> */}
      <Layout></Layout>
      {posts.length > 0 ? posts.map(post => {
        return <Post {...post} />
      }) : (<p style={{ textAlign: 'center' }}>No posts to display</p>)}

    </>
  )
}
