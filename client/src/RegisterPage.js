import React, { useState } from 'react'
import "./App.css"
import './Form.css'
export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function register(ev) {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      })
    
      if (response.status === 200) {
        alert("Registration success");
    } 
  }catch (error) {
    // Handle any network errors or exceptions
    console.error('Error:', error);
    alert("Registration failed due to an error");
    }
    setUsername('')
    setPassword('')
}
  return (
    <div className="center" onSubmit={register}>
    <h1>Register</h1>
    <form>
      <div className="inputbox">
        <input type="text" required="required"  onChange={(ev) => setUsername(ev.target.value)} value={username}/>
        <span>Email</span>
      </div>
      <div className="inputbox">
        <input type="text" required="required"onChange={(ev)=>setPassword(ev.target.value)} value={password}/>
        <span>Password</span>
      </div>
      <div class="buttons">
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
    </form>
  </div>
  )
}
