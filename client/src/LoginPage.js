import React from 'react'
import "./App.css"
import { useState } from 'react'
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
 async function loginInfo(ev) {
    //console.log(username, password)
   ev.preventDefault();
   try {
  const response=  await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers:{'Content-Type':'appication/json'}
  })
     if (response.status === 200) {
       alert("login successfully")
     } else {
      alert("login failed")
     }
   } catch(err) {
     alert(err)
 }
   
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
