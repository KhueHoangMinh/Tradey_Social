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
//       var posts = document.getElementsByClassName('user-post')
  
//       for(var i = 0; i < posts.length; i++) {
//           var image = posts[i].getElementsByClassName('user-image')[0]
//           // image.crossOrigin = 'use-credentials'
//           var rgb = getAverageRGB(image);
//           posts[i].style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
//       }
      
//       function getAverageRGB(imgEl) {
      
//           var blockSize = 50, // only visit every 5 pixels
//               defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
//               canvas = document.createElement('canvas'),
//               context = canvas.getContext('2d'),
//               data, width, height,
//               i = -4,
//               length,
//               rgb = {r:0,g:0,b:0},
//               count = 0;
              
//           if (!context) {
//               return defaultRGB;
//           }
          
//           height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
//           width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
          
//           context.drawImage(imgEl, 0, 0);
          
//           try {
//               data = context.getImageData(0, 0, width, height);
//           } catch(e) {
//               throw{e}
//           }
          
//           length = data.data.length;
          
//           while ( (i += blockSize * 4) < length ) {
//               ++count;
//               rgb.r += data.data[i];
//               rgb.g += data.data[i+1];
//               rgb.b += data.data[i+2];
//           }
          
//           // ~~ used to floor values

//           var red = ~~(rgb.r/count*50/100)
//           var green = ~~(rgb.g/count*50/100)
//           var blue = ~~(rgb.b/count*50/100)

//           if(red > 50) red = 50
//           if(green > 50) green = 50
//           if(blue > 50) blue = 50

//           rgb.r = red;
//           rgb.g = green;
//           rgb.b = blue;
          
//           return rgb;
      
//       }
// },[posts])
  return (
    <MainStyle>
      {
      loading === 1 ?
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
padding: 0 10px;
width: calc(100% - 20px);
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
