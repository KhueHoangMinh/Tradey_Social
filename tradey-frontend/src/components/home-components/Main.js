import React, { useState,useEffect } from 'react'
import styled from 'styled-components'
import Post from './Post'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import Loading from '../Loading.js'

function Main(props) {
  const [posts, setPosts] = useState()
  const [loading,setLoading] = useState(0)
  const [showingCommentInput, setShowingCommentInput] = useState()
  const [showingShareInput, setShowingShareInput] = useState()
  const user = useSelector(state=>state.auth.user)
  useEffect(()=>{
    console.log('getting posts')
    Axios.get('/api/getposts')
    .then(res=>{
      setPosts(res.data)
      setLoading(1)
    })
  },[])

  // useEffect(()=>{
  //   const oldScript = document.getElementById("average-color");
  //   if(oldScript) oldScript.remove()
  //   const script = document.createElement('script')
  //   script.id = 'average-color'
  //   script.src = '/js/AverageColor.js'
  //   script.async = true

  //   document.body.appendChild(script);
  // },[posts])
  return (
    <MainStyle>
      {
      loading == 1 ?
      ( 
        posts && posts.map((post)=>(
          <Post 
            userId = {user.user_id}
            id = {post.post_id}
            showingCommentInput = {showingCommentInput}
            setShowingCommentInput = {setShowingCommentInput}
            showingShareInput = {showingShareInput}
            setShowingShareInput = {setShowingShareInput}
            contentType = 'post'
          />
        ))
      ):<Loading></Loading>
    }
    </MainStyle>

  )
}

const MainStyle = styled.div`
position: relative;
overflow: auto;
padding-right: 20px;
width: calc(100% - 40px);
::-webkit-scrollbar {
  display: none;
}
@media (max-width: 1200px) {
  padding: 0;
  width: calc(100%);
  overflow: unset;
}
`



export default Main
