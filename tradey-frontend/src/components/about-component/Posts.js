import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import Post from '../home-components/Post'
import Loading from '../Loading'

function Posts(props) {
  const [posts, setPosts] =  useState([])
  const [loading,setLoading] = useState(0)
  const [showingCommentInput, setShowingCommentInput] = useState()
  const [showingShareInput, setShowingShareInput] = useState()
  useEffect(()=>{
    Axios.post('/api/getuserposts', {userId: props.user.user_id})
    .then(res=>{
      setPosts(res.data)
      setLoading(1)
    })
  },[])
  return (
    <div className='posts'>
      {
        loading === 1 ? (posts.map((post)=>(
          <Post
          userId = {props.currentUser.user_id}
          id = {post.post_id}
          showingCommentInput = {showingCommentInput}
          setShowingCommentInput = {setShowingCommentInput}
          showingShareInput = {showingShareInput}
          setShowingShareInput = {setShowingShareInput}
          contentType = 'post'
          />
        ))): <Loading></Loading>
      }
    </div>
  )
}

export default Posts
