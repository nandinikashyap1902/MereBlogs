import React from 'react'
import './App.css'
import { Link } from 'react-router-dom'
 import {formatISO9075} from 'date-fns'
export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  let shortContent = "";
//   if (content.includes("<br></p>")) {
//  shortContent= content.replace("<br></p>","")
//   }
   shortContent = content.toString().replaceAll("<p>","").slice(0,90)
  
  return (
  <>
  <hr></hr>
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${process.env.apiUrl}/`+cover} alt="" />
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
        <div dangerouslySetInnerHTML={{ __html: shortContent }} />
      </div>
      </div>
      </>
  )
}
