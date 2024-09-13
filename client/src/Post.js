import React from 'react'
import './App.css'
export default function Post() {
  return (
    <div className="post">
    <div className="image">
    <img src="https://www.marthastewart.com/thmb/qq94YZhTQ4zz7jwRbkn4OfUb4Tc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/blooming-azalea-plant-getty-1221-2000-65bfc3a5812c4286a2c22aeeddd491f6.jpg" alt=""/>
    </div>
    <div className="texts">
      <h2>How flowers are important in our life?</h2>
      <p className="info">
        <a  href="./"className="author">nandini</a>
        <time>2023-01-06 16:45</time>
      </p>
    <p className="summary">Many flowers are possible to eat, and they have fed and sweetened many generations. The flowers form an integral part of many foods, such as salads and soaps, and are also used in jellies, jams, wine, and even tea production.</p>
      </div>
  </div>
  )
}
