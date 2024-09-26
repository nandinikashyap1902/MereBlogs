import React from 'react'
import "./App.css"
import { useState,useContext } from 'react'
import {Navigate} from 'react-router-dom'
import { UserContext } from './UserContext'
export default function LoginPage() {
  const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const {setUserInfo} = useContext(UserContext)
 async function loginInfo(ev) {
   ev.preventDefault();
   try {
    const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },  // Corrected typo
        credentials:'include'
     });
    
    // Check if the login was successful
    if (response.ok) {
        alert("Login successful");
        response.json().then(userInfo => {
            setUserInfo(userInfo)
            //console.log(userInfo)
            setRedirect(true)
        })
    } else {
        alert("Login failed");
    }
} catch (err) {
    alert("An error occurred: " + err.message);
     }
     setUsername('')
     setPassword('')
}
    if (redirect) {
        return <Navigate to={'/'} />
}
  return (
      <form className='login' onSubmit={loginInfo}>
          <h1>Login</h1>
      <input type='text' placeholder='username' onChange={(ev) => setUsername(ev.target.value)} value={username} /> 
      <input type='password' placeholder='password' onChange={(ev)=>setPassword(ev.target.value)} value={password} /> 
        <button >Login</button>
    </form>
  )
}
