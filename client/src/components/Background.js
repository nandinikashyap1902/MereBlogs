import React from 'react';
import background from '../assets/background.json';
import Lottie from 'lottie-react';
import '../styles/bg.css';
import man from '../assets/laptopMan.json';
import MobileMan from '../assets/MobileMan.json';
import Layout from './Layout';

export default function Background() {
    return (
        <>
            <div className="layout">
                <Layout />
            </div>

            <div className="bg-container">
                <Lottie animationData={background} className="lottie-animation" />

                <div className="Back-laptopMan">
                    <Lottie animationData={man} className="laptopman" />
                    <div className="text">
                        <h1 style={{ fontSize: '40px' }} className="typing-text">
                            Welcome to MereBlogs
                        </h1>
                        <h4>Your Ultimate Blogging Playground</h4>
                        <p>Unleash your creativity! Share your insights, stories, and passions.</p>
                        <p>Join us today and start your blogging journey!</p>
                    </div>
                </div>

                <div className="Back-MobileMan">
                    <div className="text">
                        <h1 style={{ fontSize: '40px' }} className="typing-text">
                            Discover Your Voice!
                        </h1>
                        <p>Join us today and start your blogging journey!</p>
                    </div>
                    <Lottie animationData={MobileMan} className="mobileman" />
                </div>
            </div>

            <footer>
                <Lottie id="footer" animationData={background} />
            </footer>
        </>
    );
}
