import React from 'react'
import "./App.css"
import { useState } from 'react'
import {Navigate} from 'react-router-dom'
export default function LoginPage() {
  const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect,setRedirect] = useState(false)
 async function loginInfo(ev) {
    console.log(username, password)
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
        setRedirect(true)
    } else {
        alert("Login failed");
    }
} catch (err) {
    alert("An error occurred: " + err.message);
}
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
