import React from 'react'
import './App.css'
import { Link } from 'react-router-dom'
 import {formatISO9075} from 'date-fns'
export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  console.log(content)
  return (
  
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn99DM-k1UQaqmx_jUB1BcE2851rFR1CLZaw&s" alt="" />
          </Link>
      </div>
      
      <div className="texts">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
      </Link>
        
        <p className="summary">{summary}</p>

        {/* <p className="info">
          <a href="./" className="author">By-{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
      </p> */}
        <p>{content}</p>
      </div>
  </div>
  )
}
