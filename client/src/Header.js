import React, { useContext} from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { UserContext } from './UserContext'
import Lottie from 'lottie-react'
import bg from './assets/header-bg.json'
export default function Header() {
 const {userInfo,setUserInfo} = useContext(UserContext)
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials:'include'
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo.username)
      })
    })
  }, [])
  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method:'POST'
    })
    setUserInfo(null)
  }
  const username = userInfo?.username
  return (
    <header>
        <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" >Login</Link>
            <Link to="/register" >Register</Link>
          </>
        )

        }
          
<Lottie animationData={bg}></Lottie>
         
        </nav>
      </header>
  )
}
