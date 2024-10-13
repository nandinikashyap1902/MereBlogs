import React, { useEffect, useState,useContext } from 'react'
import Post from './Post'
import Layout from './Layout';
import { UserContext } from './UserContext'
export default function Posts() {
  const [posts, setPosts] = useState([])
  const {userInfo} = useContext(UserContext)
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post`, {
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
      <Layout></Layout>
      {posts.length > 0 ? posts.map(post => {
      return  <Post {...post}  />
      }) :(<p style={{ textAlign: 'center' }}>No posts to display</p>)}
      
      </>
  )
}
