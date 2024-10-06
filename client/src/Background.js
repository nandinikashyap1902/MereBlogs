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
            <div className="layout">
          <Layout ></Layout>
          {/* <Lottie className='footerAni' animationData={footerAnimation}></Lottie> */}
            </div>
            )}
      <div classname="bg-box">
        <Lottie animationData={background} className="lottie-animation"></Lottie>
        
          <div className="laptopMan">
              <Lottie animationData={man} className="man"></Lottie>
              <div className="text">
              <h2>Hii my name is Jacko...</h2>
                  <h3>A blog (a truncation of "weblog") is an informational website consisting of discrete, often informal diary-style text entries (posts).</h3>
                  <p>A blog (a truncation of "weblog") is an informational website co</p>
              </div>
        </div>
        
        <div className="laptopMan man2">
        <div className="text">
              <h2>Hii my name is Jacko...</h2>
                  <h3>A blog (a truncation of "weblog") is an informational website consisting of discrete, often informal diary-style text entries (posts).</h3>
                  <p>A blog (a truncation of "weblog") is an informational website co</p>
              </div>
          <Lottie animationData={MobileMan} className='man'></Lottie>
          
        </div>
        <div class="typing-text">This is a typing effect.</div>
          <div className="post-container">
              <Lottie animationData={arrow} className="arrow"></Lottie>
              <button onClick={toggleNavbar}> {showNavbar ? 'Hide Navbar' : 'Show Navbar'}</button>
          </div>
          <footer >
              <Lottie  id="footer" animationData={background}></Lottie>
          </footer>
        </div>
        </>
  )
}

export default Background