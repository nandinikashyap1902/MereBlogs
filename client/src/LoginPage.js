import React from 'react'
import "./App.css"
import { useState,useContext } from 'react'
import {Navigate} from 'react-router-dom'
import { UserContext } from './UserContext'
import './Form.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export default function LoginPage() {
  const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const {setUserInfo} = useContext(UserContext)
  async function loginInfo(ev) {
    // console.log(username,password)
    // if (username==='' && password==='') {
    //   return  MySwal.fire({
    //    title: 'failed!',
    //    text: 'Your action was unsuccessful.',
    //    icon: 'error',
    //    confirmButtonText: 'Try again!'
    //   })
    // }
   ev.preventDefault();
   
   
   try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },  // Corrected typo
        credentials:'include'
     });
    
    // Check if the login was successful
    if (response.ok) {
      
        response.json().then(userInfo => {
            setUserInfo(userInfo)
             console.log(userInfo)
            setRedirect(true)
        })
        MySwal.fire({
          title: 'Success!',
          text: 'Your action was successful.',
          icon: 'success',
          confirmButtonText: 'OK'
         })
    } else {
      MySwal.fire({
        title: 'login failed!',
        text: 'Your action was unsuccessful.',
        icon: 'error',
        confirmButtonText: 'Try Again!'
       })
    }
} catch (err) {
    alert("An error occurred: " + err.message);
     }
     setUsername('')
   setPassword('')
   
}
    if (redirect) {
        return <Navigate to={'/posts'} />
  }
  // console.log(userInfo)
  return (
    <div className="center login" onSubmit={loginInfo}>
    <h1>Login</h1>
    <form>
      <div className="inputbox">
        <input type="text" required="required"  onChange={(ev) => setUsername(ev.target.value)} value={username}/>
        <span>Email</span>
      </div>
      <div className="inputbox">
        <input type="password" required="required" onChange={(ev)=>setPassword(ev.target.value)} value={password}/>
        <span>Password</span>
      </div>
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
      </form>
      
  </div>
  )
}
