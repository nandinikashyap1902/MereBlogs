import React from 'react'
import background from './assets/background.json'
import Lottie from 'lottie-react';
import './bg.css'
import man from './assets/laptopMan.json'
import MobileMan from './assets/MobileMan.json'
import arrow from './assets/arrow.json'
import footerAnimation from './assets/footerAnimation.json'
import Layout from './Layout';
import  { useState } from 'react';
function Background() {
    const [showNavbar, setShowNavbar] = useState(true);
    const toggleNavbar = () => {
        setShowNavbar(!showNavbar);
      };
    return (<>
        {showNavbar && (
            <div className="layout" >
          <Layout ></Layout>
          {/* <Lottie className='footerAni' animationData={footerAnimation}></Lottie> */}
            </div>
            )}
      <div classname="bg-box">
        <Lottie animationData={background} className="lottie-animation"></Lottie>
        
          <div className="laptopMan">
              <Lottie animationData={man} className="man"></Lottie>
              <div className="text">
              <h1 style={{fontSize:'40px'}} className='typing-text'>WELCOME TO THIS SITE!!</h1>
                  <h3>A free Blog creation place</h3>
                  <p>Share your thoughts,and experiences!!</p>
              </div>
        </div>
        
        <div className="laptopMan man2">
        <div className="text">
              <h1>Just create and post</h1>
                  <h3>A blog (a truncation of "weblog") is an informational website consisting of discrete, often informal diary-style text entries (posts).</h3>
                  <p>A blog (a truncation of "weblog") is an informational website co</p>
              </div>
          <Lottie animationData={MobileMan} className='man'></Lottie>
          
        </div>
        <div class="typing-text">
          <h1>Press down to show your creations.</h1></div>
          <div className="post-container">
              <Lottie animationData={arrow} className="arrow"></Lottie>
          {/* <button onClick={toggleNavbar}> {showNavbar ? 'Hide Navbar' : 'Show Navbar'}</button> */}
          <div class="buttons">
  <button class="blob-btn" onClick={toggleNavbar}>
  {showNavbar ? 'POST' : 'Show Navbar'}
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
          </div>
          <footer >
              <Lottie  id="footer" animationData={background}></Lottie>
          </footer>
        </div>
        </>
  )
}

export default Background