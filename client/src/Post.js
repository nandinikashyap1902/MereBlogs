import React from 'react'
import './App.css'
import {formatISO9075} from 'date-fns'
export default function Post({title,summary,cover,content,createdAt}) {
  return (
    <div className="post">
    <div className="image">
    <img src="https://www.marthastewart.com/thmb/qq94YZhTQ4zz7jwRbkn4OfUb4Tc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/blooming-azalea-plant-getty-1221-2000-65bfc3a5812c4286a2c22aeeddd491f6.jpg" alt=""/>
    </div>
    <div className="texts">
        <h2>{title}</h2>
      <p className="info">
        <a  href="./"className="author">nandini</a>
          <time>{createdAt}</time>
      </p>
        <p className="summary">{summary}</p>
      </div>
  </div>
  )
}
