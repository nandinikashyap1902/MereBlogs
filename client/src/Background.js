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
      <div className='bg-container'>

    
        <Lottie animationData={background} className="lottie-animation"></Lottie>
        
          <div className="Back-laptopMan">
              <Lottie animationData={man} className="laptopman"></Lottie>
              <div className="text">
              <h1 style={{fontSize:'40px'}} className='typing-text'>Welcome to MereBlogs</h1>
<h4>Your Ultimate Blogging Playground</h4>
<p>Unleash your creativity! Share your insights, stories, and passions.</p>
<p>Join us today and start your blogging journey!</p>

              </div>
        </div>
        
        <div className="Back-MobileMan">
        <div className="text">
        <h1 style={{fontSize:'40px'}} className='typing-text'>Discover Your Voice!</h1>

<p>Join us today and start your blogging journey!</p>
              </div>
          <Lottie animationData={MobileMan} className='mobileman'></Lottie>
        </div>
       </div>
          <footer >
              <Lottie  id="footer" animationData={footerAnimation}></Lottie>
          </footer>
    
        </>
  )
}

export default Background