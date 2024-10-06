import React, { useContext} from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { UserContext } from './UserContext'
// import Lottie from 'lottie-react'
// import bg from './assets/header-bg.json'
import './Button.scss'
export default function Header() {
 const {userInfo,setUserInfo} = useContext(UserContext)
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials:'include'
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo)
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
      
        <Link to="/" className="logo">MERE-BLOGS</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">
              <div class="buttons">
                {/* <avatar>Hiii{username}</avatar> */}
  <button class="blob-btn">
   Post
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>
  <br/>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>
              </svg>
              </div>
            </Link>
            
            <Link onClick={logout}>
            <div class="buttons">
  <button class="blob-btn">
  Logout
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>
  <br/>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>
              </svg>
              </div>
            </Link>
          </>
        )}
      
        {!username && (
          <>
            {/* <Link to="/login" >Login</Link> */}
            <Link to="/login">
            <div class="buttons">
  <button class="blob-btn">
    Login
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>
  <br/>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>
              </svg>
              </div>
              </Link>
            <Link to="/register" >
            <div class="buttons">
  <button class="blob-btn">
   SignUp
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>
  <br/>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>
              </svg>
              </div>
            </Link>
          </>
        )

        }
          
{/* <Lottie animationData={bg}></Lottie> */}
         
        </nav>
      </header>
  )
}
