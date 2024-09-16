import React, { useState } from 'react'
import "./App.css"
export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  async function register(ev) {
    ev.preventDefault();
    await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers:{'Content-Type':'application/json'}
     })
  }


  return (
      <form className='register' onSubmit={register}>
          <h1>Register</h1>
    <input type='text' placeholder='username' onChange={ev=>setUsername(ev.target.value)} value={username}/> 
    <input type='password' placeholder='password' onChange={ev=>setPassword(ev.target.value)} value={password}/> 
    <button>Register</button>
</form>
  )
}
