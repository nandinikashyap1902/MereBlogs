import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import man from '../assets/laptopMan.json';
import MobileMan from '../assets/MobileMan.json';
import { UserContext } from '../context/UserContext';
import '../styles/Home.css';

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write & Publish',
    desc: 'Craft beautiful posts with our rich text editor. Add images, code, and formatting in seconds.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Writing',
    desc: 'Stuck? Let our Gemini AI generate a full blog draft or improve your existing content instantly.',
  },
  {
    icon: '🔍',
    title: 'Discover Stories',
    desc: 'Search and explore posts from writers around the world. Find content that inspires you.',
  },
  {
    icon: '❤️',
    title: 'Like & Save',
    desc: 'React to posts you love, bookmark them to read later, and build your personal reading list.',
  },
  {
    icon: '💬',
    title: 'Join the Conversation',
    desc: 'Comment on posts and connect with writers who share your perspective and passion.',
  },
  {
    icon: '📊',
    title: 'Track Engagement',
    desc: 'See how many people read and liked your posts. Understand what resonates with your audience.',
  },
];

const STATS = [
  { value: '10K+', label: 'Stories Published' },
  { value: '500+', label: 'Active Writers' },
  { value: '50K+', label: 'Monthly Readers' },
  { value: '100%', label: 'Free Forever' },
];

export default function Background() {
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username;

  return (
    <div className="home">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="hero">
        {/* Decorative blobs */}
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />

        <div className="hero__content">
          <div className="hero__text">
            <span className="hero__eyebrow">🚀 Your blogging platform</span>
            <h1 className="hero__title">
              Write. Share.
              <br />
              <span className="hero__title--accent">Inspire.</span>
            </h1>
            <p className="hero__subtitle">
              MereBlogs is where ideas come alive. Write beautiful posts,
              discover inspiring stories, and connect with a community of thinkers.
            </p>
            <div className="hero__cta">
              {username ? (
                <>
                  <Link to="/create" className="btn btn--primary">✍️ Write a Post</Link>
                  <Link to="/feed"   className="btn btn--ghost">📰 Browse Feed</Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn--primary">Get Started Free</Link>
                  <Link to="/feed"     className="btn btn--ghost">Browse Stories →</Link>
                </>
              )}
            </div>
          </div>

          <div className="hero__animation">
            <Lottie animationData={man} className="hero__lottie" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll-hint">
          <span>Scroll to explore</span>
          <div className="hero__scroll-arrow" />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="stats">
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <span className="stat-card__value">{s.value}</span>
            <span className="stat-card__label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Everything you need to <span>blog better</span></h2>
          <p className="section-subtitle">
            A complete platform built for modern writers — from first draft to engaged audience.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DISCOVER SECTION ──────────────────────────────────────── */}
      <section className="discover">
        <div className="discover__animation">
          <Lottie animationData={MobileMan} className="discover__lottie" />
        </div>
        <div className="discover__text">
          <h2>Discover Your <span>Voice</span></h2>
          <p>
            Every great writer started with a single post. MereBlogs gives you
            the tools, the audience, and the inspiration to find your unique voice
            and share it with the world.
          </p>
          <ul className="discover__list">
            <li>✅ Rich text editor with image uploads</li>
            <li>✅ AI writing assistant powered by Gemini</li>
            <li>✅ Built-in search & discovery</li>
            <li>✅ Real-time engagement metrics</li>
          </ul>
          {!username && (
            <Link to="/register" className="btn btn--primary" style={{ marginTop: '24px', display: 'inline-block' }}>
              Start Writing Today →
            </Link>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      {!username && (
        <section className="cta-banner">
          <div className="cta-banner__blob" />
          <h2>Ready to share your story?</h2>
          <p>Join hundreds of writers on MereBlogs. It's free, always.</p>
          <div className="hero__cta">
            <Link to="/register" className="btn btn--white">Create Your Account</Link>
            <Link to="/login"    className="btn btn--ghost-white">Sign In</Link>
          </div>
        </section>
      )}

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <span className="site-logo__text">MERE</span>
            <span className="site-logo__accent">BLOGS</span>
          </div>
          <p className="site-footer__tagline">Your Ultimate Blogging Playground</p>
          <nav className="site-footer__nav">
            <Link to="/feed">Feed</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/login">Login</Link>
          </nav>
          <p className="site-footer__copy">© {new Date().getFullYear()} MereBlogs. Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
