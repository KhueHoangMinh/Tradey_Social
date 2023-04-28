import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import Post from './Post'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import Loading from '../Loading.js'

function Main(props) {
  const [posts, setPosts] = useState()
  const [loading,setLoading] = useState(0)
  const user = useSelector(state=>state.auth.user)
  // console.log(user)
  useEffect(()=>{
    Axios.get('/api/getposts')
    .then(res=>{
      setPosts(res.data)
      setLoading(1)
    })
  },[])

  useEffect(()=>{
    // console.log(posts)
  },[posts])
  return (
    <div>
      {
      loading == 1 ?
      (posts && posts.map((post)=>(
        <Post 
          userId = {user.user_id}
          id = {post.post_id}
          displayName = {post.name}
          email = {post.email}
          photoURL = {post.photourl}
          time = {post.time}
          description = {post.description}
          image = {post.image}
          video = {post.video}
        />
      ))):<><Loading></Loading></>
    }
    </div>
  )
}



export default Main
