import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { UserContext } from './UserContext'
// import Lottie from 'lottie-react'
// import bg from './assets/header-bg.json'
import './Button.scss'
import './App.css'

export default function Header() {
  const navigate = useNavigate();

  const { userInfo, setUserInfo } = useContext(UserContext)
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      method: 'GET',
      credentials: 'include'
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo)
      })
    })
  }, [setUserInfo])
  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: 'include',
      method: 'POST'
    })
      .then((response) => {
        if (response.ok) {
          // setUserInfo(null); // Clear user info state
          setUserInfo(null);

          // Redirect to login page and replace history
          navigate('/login', { replace: true });

          // Optionally, force a full page reload to clear any cached data
          // window.location.reload();
        } else {
          console.error('Failed to log out');
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }
  // useEffect(() => {
  //   setUserInfo(null);
  // }, []);
  useEffect(() => {
    setDropdownVisible(false);
  }, [location]);
  const username = userInfo?.username
  let name = username ? username.toString().split('@') : ''
  name = name[0]
  const handleMouseEnter = () => {
    if (location.pathname === '/posts') return;
    setDropdownVisible(!dropdownVisible);
  };


  return (
    <header>

      <Link to="/" className="logo">MERE-BLOGS</Link>
      <nav>
        {username && (
          <>
            <div className="user-info" onMouseEnter={handleMouseEnter}
            >

              <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                WelcomeBack,
                {name}
              </p>
              {location.pathname !== '/posts' && (
                <div className={`dropdown-menu ${location.pathname === '/posts' ? 'disabled' : ''}`}>
                  <Link to="/posts">My posts</Link>
                </div>
              )}
            </div>
            <Link to="/generate">
              <div className="buttons">
                <button className="blob-btn">
                  AI Write
                  <span className="blob-btn__inner">
                    <span className="blob-btn__blobs">
                      <span className="blob-btn__blob"></span>
                      <span className="blob-btn__blob"></span>
                      <span className="blob-btn__blob"></span>
                      <span className="blob-btn__blob"></span>
                    </span>
                  </span>
                </button>
                <br />
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
                <br />

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
                <br />

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
                <br />

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
                <br />

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
