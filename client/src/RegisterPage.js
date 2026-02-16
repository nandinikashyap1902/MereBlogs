import React, { useState } from 'react'
import "./App.css"
import './Form.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Navigate } from 'react-router-dom'
const MySwal = withReactContent(Swal)
// const validateEmail = (email) => {
//   // Basic email regex
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };
// const validatePassword = (password) => {
//   // Basic password length check
//   return password.length >= 6;
// };
export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [Error, setError] = useState('')
  // const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState('');
  const [redirect, setRedirect] = useState(false)
  async function register(ev) {
    // setEmailError(validateEmail(username) ? '' : 'Please enter a valid email');
    // setPasswordError(validatePassword(password)?'':'Password must be at least 6 characters')
    ev.preventDefault();
    console.log(process.env.REACT_APP_API_URL)
    if (password.length > 10) {
      setError('Password must be up to 10 characters')
      return
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {

        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.status === 200) {
        MySwal.fire({
          title: 'Success!',
          text: 'Your action was successful.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        setRedirect(true)

      }
    } catch (error) {
      // Handle any network errors or exceptions
      MySwal.fire({
        title: 'Failed!',
        text: 'Your action was unsuccessful.',
        icon: 'error',
        confirmButtonText: 'Try Again!'
      })
    }



    setError('')
    setUsername('')
    setPassword('')
  }
  if (redirect) {
    return (
      <Navigate to="/login" />
    )
  }
  return (
    <div className="center register">
      <h1>Register</h1>
      <form onSubmit={register}>
        <div className="inputbox">
          <input type="email" required="required" onChange={(ev) => setUsername(ev.target.value)} value={username} />
          <span>Email</span>

        </div>
        <div className="inputbox">
          <input type="password" required="required" onChange={(ev) => setPassword(ev.target.value)} value={password} maxLength={10} />
          <span>Password</span>

        </div>
        <div className="error">{Error}</div>
        <div class="buttons">
          <button class="blob-btn">
            Register
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
      </form>
    </div>
  )
}
