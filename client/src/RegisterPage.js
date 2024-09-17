import React, { useState } from 'react'
import "./App.css"
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
    } else {
        alert("Registration failed");
    }
  }catch (error) {
    // Handle any network errors or exceptions
    console.error('Error:', error);
    alert("Registration failed due to an error");
  }
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
