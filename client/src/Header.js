import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
export default function Header() {
  const [username,setUsername] = useState('')
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials:'include'
    }).then(res => {
      res.json().then(userInfo => {
        setUsername(userInfo.username)
      })
    })
  },[])
  return (
    <header>
        <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" >Login</Link>
            <Link to="/register" >Register</Link>
          </>
        )

        }
          
        </nav>
      </header>
  )
}
