import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Axios  from 'axios'

function LeftSide(props) {
  const user = useSelector(state=>state.auth.user)
  console.log(user);
  const [postText,setPostText] = useState()
  const [image,setImage] = useState(null)
  const [video,setVideo] = useState(null)
  const date = new Date()

  const postArticle = ()=>{
    Axios.post('/api/post', {
      publisherId: user.user_id,
      time: date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+date.getDate().toString()+' '+date.getHours().toString()+'-'+date.getMinutes().toString()+'-'+date.getSeconds().toString(),
      description: postText,
      image: image,
      video: video
    },{
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(result=>console.log(result))
  }
  return (
    <div>
        <Panel>
            <h2>Share your day!</h2>
            <div className='userinfo'>
              <img src={user ? user.photoURL:''} alt=''/>
              <div>
                <h3>{user ? user.displayName : ''}</h3>
                <span>{user ? user.email : ''}</span>
              </div>
            </div>
            <textarea type='text' value={postText} onChange={(e)=>{setPostText(e.target.value)}}/>
            {image && 
            <img src={URL.createObjectURL(image)} alt=''/>}
            {video && 
              <video controls>
                <source src={URL.createObjectURL(video)} type='video'/>
              </video>}
            <div className='buttons'>
              <div>
                <label className='imgbtn'>
                  <img src='/images/image.svg' alt=''/>
                  Image
                  <input name='uploadedImage' type='file' style={{display: 'none'}} onChange={e=>setImage(e.target.files[0])}/>
                </label>
                <label className='vidbtn'>
                  <img src='/images/video.svg' alt=''/>
                  Video
                  <input name='uploadedVideo' type='file' style={{display: 'none'}} onChange={e=>setVideo(e.target.files[0])}/>
                </label>
              </div>
              <button className='postbtn' onClick={postArticle}>Post</button>
            </div>
        </Panel>
    </div>
  )
}

const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
padding: 30px;
display: flex;
flex-direction: column;
position: fixed;
width: calc(25% - 80px);
h2 {
  text-align: center;
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
  padding-bottom: 5px;
  color: rgb(51,255,255);
  letter-spacing: 3px;
}
.userinfo {
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(200,200,200);

  div{
    display: flex;
    flex-direction: column;
    h3 {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
    }

    span {
      color: rgb(200,200,200);
      font-size: 15px;
    }
  }
  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

textarea {
background-color: transparent;
border: 1px solid rgb(250,250,250);
height: 100px;
margin-bottom: 20px;
color: white;
}

label {
  color: rgb(230,230,230);
  font-weight: 600;
  width: 60px;
  height: 30px;
  padding: 2px 5px;
  transition: 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

button {
  color: rgb(230,230,230);
  font-weight: 600;
  width: 60px;
  height: 30px;
  padding: 2px 5px;
  transition: 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.buttons {
  display: inline-flex;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    button {
      width: 70px;
    }
    .imgbtn {
      background-color: rgba(51,255,51,0.3);
      img {
        margin-right: 2px;
        width: 10px;
      }
      &:hover {
        background-color: rgba(51,255,51,0.7);
      }
    }
    .vidbtn {
      background-color: rgba(255,51,51,0.3);
      img {
        margin-right: 2px;
        width: 10px;
      }
      &:hover {
        background-color: rgba(255,51,51,0.7);
      }
    }
  }
  .postbtn {
    background-color: rgba(51,255,255,0.3);
    border-radius: 20px;
      &:hover {
        background-color: rgba(51,255,255,0.7);
      }
  }
}
@media (max-width: 1200px) {
  position: relative;
  width: calc(100% - 60px);
}
`

export default LeftSide
