import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import Post from '../home-components/Post'
import Loading from '../Loading'

function Posts(props) {
  const [posts, setPosts] =  useState([])
  const [loading,setLoading] = useState(0)
  useEffect(()=>{
    Axios.post('/api/getuserposts', {userId: props.user.user_id})
    .then(res=>{
      setPosts(res.data)
      setLoading(1)
    })
  },[])
  return (
    <div>
      {
        loading == 1 ? (posts.map((post)=>(
          <Post
          userId = {props.user.user_id}
          id = {post ? post.post_id:''}
          displayName = {props.user.displayName}
          email = {props.user.email}
          photoURL = {props.user.photoURL}
          time = {post ? post.time:''}
          description = {post ? post.description:''}
          image = {post ? post.image:''}
          video = {post ? post.video:''}/>
        ))): <Loading></Loading>
      }
    </div>
  )
}

export default Posts
