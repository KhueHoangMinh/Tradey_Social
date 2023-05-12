import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Loading from '../Loading'
import ChatBox from './chat-component/ChatBox.js'
import { useSelector } from 'react-redux'

function RightSide() {
  const [advertisement, setAdvertisement] = useState([])
  const [users,setUsers] = useState([])
  const [loading,setLoading] = useState(0)
  const [loading1,setLoading1] = useState(0)
  const [chatting,setChatting] = useState(null)
  const user = useSelector(state => state.auth.user)
  const [showingAd, setShowingAd] = useState(0)
  useEffect(()=>{
    Axios.post('/api/getadvertisement')
    .then(res=> {
      setAdvertisement(res.data)
      setLoading(1)
    })
  },[])

  useEffect(()=>{
    if(user) {
      Axios.post('/api/getfriends', {userId: user.user_id})
      .then(res=>{
        setUsers(res.data)
        console.log(res.data)
        setLoading1(1)
      })
    }
  },[user])

  useEffect(()=>{
    if(advertisement.length > 0) {
      setTimeout(()=>{
          var ad = document.getElementById("advertisement")
          ad.style.opacity = 0;
          setTimeout(()=>{
            if(showingAd < advertisement.length - 1) {
              setShowingAd(showingAd+1)
            } else {
              setShowingAd(0)
            }
            ad.style.opacity = 1
          },400)
      }, 5000)
    }
  },[advertisement,showingAd])

//   useEffect(()=>{
//     var users = document.getElementsByClassName('user-item')

//     for(var i = 0; i < users.length; i++) {
//         var image = users[i].getElementsByClassName('user-image')[0]
//         // image.crossOrigin = 'Anonymous'
//         var rgb = getAverageRGB(image);
//         users[i].style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
//     }
    
//     function getAverageRGB(imgEl) {
    
//         var blockSize = 50, // only visit every 5 pixels
//             defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
//             canvas = document.createElement('canvas'),
//             context = canvas.getContext('2d'),
//             data, width, height,
//             i = -4,
//             length,
//             rgb = {r:0,g:0,b:0},
//             count = 0;
            
//         if (!context) {
//             return defaultRGB;
//         }
        
//         height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
//         width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
        
//         context.drawImage(imgEl, 0, 0);
        
//         try {
//             data = context.getImageData(0, 0, width, height);
//         } catch(e) {
//             throw{e}
//         }
        
//         length = data.data.length;
        
//         while ( (i += blockSize * 4) < length ) {
//             ++count;
//             rgb.r += data.data[i];
//             rgb.g += data.data[i+1];
//             rgb.b += data.data[i+2];
//         }
        
//         // ~~ used to floor values

//         var red = ~~(rgb.r/count*50/100)
//         var green = ~~(rgb.g/count*50/100)
//         var blue = ~~(rgb.b/count*50/100)

//         if(red > 50) red = 50
//         if(green > 50) green = 50
//         if(blue > 50) blue = 50

//         rgb.r = red;
//         rgb.g = green;
//         rgb.b = blue;
        
//         return rgb;
    
//     }
// },[users])

  return (
    <RightSideStyle>
      <h2>Sponsors</h2>
      <Panel>
          {
            loading === 1 ? (
              <>
                <a id='advertisement' href={advertisement.length > 0 && advertisement[showingAd].link}>
                  <img src={advertisement.length > 0 && window.host + advertisement[showingAd].image} alt=''/>
                  {/* <img className='ad-bg' src={advertisement.length > 0 && window.host + advertisement[showingAd].image} alt=''/> */}
                  <div className='ad-content'>
                    <h2>
                      {advertisement.length > 0 && advertisement[showingAd].name}
                    </h2>
                    <p>
                      {advertisement.length > 0 && advertisement[showingAd].description}
                    </p>
                  </div>
                </a>
              </>
            ) : <Loading></Loading>
          }
      </Panel>
      <h2>Friends</h2>
      {
        loading1 == 1 ? (users.map(userInfo => (
          <User className='user-item' onClick={()=>{setChatting(userInfo.user_id)}}>
            <div className='user-bg'>
              <img className='user-image' crossOrigin='anonymous' src={userInfo.photourl ? window.host + userInfo.photourl : '/images/user.png'} alt=''/>
              <div>
                <h3>{userInfo.name}</h3>
                <span>{userInfo.email}</span>
              </div>
            </div>
          </User>
        ))): <Loading></Loading>
      }
      {
        chatting &&
        <div className='chat-box-container'>
          <ChatBox
            userId = {user && user.user_id}
            name = {user && user.displayName}
            chatting = {chatting}
            setChatting = {setChatting}
          />
        </div>
      }
    </RightSideStyle>
  )
}

export const User =styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 5px rgba(0,0,0,0.4);
position: relative;
width: calc(100%);
height: fit-content;
margin-bottom: 10px;
transition: 0.2s ease-in-out;
overflow: hidden;
.user-bg{
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  transition: 0.2s ease-in-out;
  div{
    display: flex;
    flex-direction: column;
  h3 {
    padding: 0;
    margin: 0;
    margin-bottom: 2px;
  }

  span {
    color: rgb(180,180,180);
    font-size: 13px;
  }
  }
  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
&:hover {
  .user-bg {
    background-color: rgba(255,255,255,0.1);
  }
  cursor: pointer;
}
`

const RightSideStyle = styled.div`
padding: 0 10px;
width: calc(100% - 20px);
height: fit-content;
max-height: calc(100%);
overflow-y: scroll;
position: relative;
::-webkit-scrollbar {
  display: none;
}
.chat-box-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  height: fit-content;
  width: fit-content;
  background-color: transparent;
}
`

const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 5px rgba(0,0,0,0.4);
padding: 20px;
position: relative;
width: calc(100% - 40px);
height: 350px;
max-height: calc(100vh - 160px);
align-items: center;
overflow: hidden;
margin-bottom: 20px;
::-webkit-scrollbar {
  display: none;
}
#advertisement {
  position: relative;
  width: 100%;
  color: white;
  text-decoration: none;
  transition: 0.4s ease-in-out;
  img {
    width: 100%;
    margin-right: 20px;
    height: 250px;
    border-radius: 10px;
    object-fit: contain;
    background-color: rgb(100,100,100);
  }
  .ad-bg {
    position: absolute;
    height: 200%;
    width: 200%;
    top: -50%;
    left: -50%;
    object-fit: cover;
  }
  .ad-content {
    padding: 5px;
    h2 {
    padding: 0;
    margin: 0;
    margin-bottom: 2px;
    }
    p {
      padding: 0;
      margin: 0;
      line-height: 20px;
      height: 60px;
      width: 100%;
      overflow: hidden;
      white-space: normal;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

}
@media (max-width: 1200px) {
  display: none;
}
`

export default RightSide
