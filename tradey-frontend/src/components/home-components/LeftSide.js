import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Axios  from 'axios'
import Button from '../Button'

function LeftSide(props) {
  const user = useSelector(state=>state.auth.user)
  const [postText,setPostText] = useState()
  const [image,setImage] = useState(null)
  const [video,setVideo] = useState(null)
  const date = new Date()

  const postArticle = (e)=>{
    e.preventDefault()
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
    .then(res=>{})
  }
  return (
    <div>
        <Panel onSubmit={e=>postArticle(e)}>
            <div className='userinfo'>
              <img src={user ? user.photoURL:''} alt=''/>
              <div>
                <h3>{user ? user.displayName : ''}</h3>
                <span>{user ? user.email : ''}</span>
              </div>
            </div>
            <textarea type='text' value={postText} onChange={(e)=>{setPostText(e.target.value)}} rows='3' placeholder='Write something...'/>
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
                {/* <label className='vidbtn'>
                  <img src='/images/video.svg' alt=''/>
                  Video
                  <input name='uploadedVideo' type='file' style={{display: 'none'}} onChange={e=>setVideo(e.target.files[0])}/>
                </label> */}
              </div>
              <button
                className='postbtn'
                type='submit'
              >Post</button>
            </div>
        </Panel>
    </div>
  )
}

const Panel = styled.form`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
padding: 30px;
display: flex;
flex-direction: column;
position: fixed;
width: calc(25% - 80px);
.userinfo {
  display: flex;
  flex-direction: row;
  margin: 10px 0;

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
border: none;
height: fit-content;
padding: 10px;
margin-bottom: 20px;
color: white;
outline: none;
line-height: 18px;
resize: none;
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
      img {
        margin-right: 2px;
        width: 18px;
      }
      width: fit-content;
      height: fit-content;
      padding: 12px 18px;
      color: white;
      transition: 0.2s ease-in-out;
      background-color: transparent;
      border-radius: 25px;
      font-size: 20px;
      font-weight: 700;
      border: none;
      &:hover {
        cursor: pointer;
        background-color: white;
        color: black;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
      }
    }
    .vidbtn {
      img {
        margin-right: 2px;
        width: 10px;
      }
      width: fit-content;
      height: fit-content;
      padding: 12px 18px;
      color: white;
      transition: 0.2s ease-in-out;
      background-color: transparent;
      border-radius: 25px;
      font-size: 20px;
      font-weight: 700;
      border: none;
      &:hover {
        cursor: pointer;
        background-color: white;
        color: black;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
      }
    }
  }
  .postbtn {
    width: fit-content;
    height: fit-content;
    padding: 12px 18px;
    color: white;
    transition: 0.2s ease-in-out;
    background-color: transparent;
    border-radius: 25px;
    font-size: 20px;
    font-weight: 700;
    border: none;
    &:hover {
      cursor: pointer;
      background-color: white;
      color: black;
      box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
    }
  }
}
@media (max-width: 1200px) {
  position: relative;
  width: calc(100% - 60px);
}
`

export default LeftSide
