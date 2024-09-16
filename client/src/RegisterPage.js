import React, { useState } from 'react'
import "./App.css"
export default function RegisterPage() {
  const[username,setUsername]=useState('')
  const[password,setPassword]=useState('')
  return (
      <form className='register'>
          <h1>Register</h1>
    <input type='text' placeholder='username'/> 
    <input type='password' placeholder='password'/> 
    <button>Register</button>
</form>
  )
}
