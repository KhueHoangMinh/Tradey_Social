import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import Axios from 'axios'
import Loading from '../Loading'

function EditDetails(props) {
    const [username,setUsername] = useState(props.user.displayName)
    const [email,setEmail] = useState(props.user.email)
    const [avatar,setAvatar] = useState(null)
    const [password, setPassword] = useState()
    const [editting,setEditting] = useState('')
    const [loading,setLoading] = useState('')

    const handleSave = (e, content) => {
        e.preventDefault()
        switch(content) {
            case 'avatar':
                setLoading('avatar')
                Axios.post('/api/users/updateuserinfo', {userId: props.user.user_id, avatar: avatar},{
                    headers: {
                      "Content-Type": "multipart/form-data"
                    }
                  })
                  .then(res => setLoading(''))
                break
                
            case 'username':
                setLoading('username')
                Axios.post('/api/users/updateuserinfo', {userId: props.user.user_id, username: username})
                .then(res => setLoading(''))
                break
                
            case 'password':
                setLoading('password')
                Axios.post('/api/users/updateuserinfo', {userId: props.user.user_id, password: password})
                .then(res => setLoading(''))
                break
        }
    }
  return (
    <div>
      <DetailsTab>
        <h2>DETAILS</h2>
        <form className='info avatar' onSubmit={e=>handleSave(e)}>
            <div className='editable'>
                <label>Avatar:</label>
                {(editting === 'avatar' && avatar !== null) ? (<img src={URL.createObjectURL(avatar)} alt=''/>):(<img src={props.user.photoURL ? window.host + props.user.photoURL : 'images/user.png'} alt=''/>)}
            </div>
            <div className='btn-box'>
            {editting !== 'avatar' || avatar === null? (
                <label className='imgbtn'>
                    <a className='edit-btn' onClick={()=>{setEditting('avatar')}}>Edit</a>
                    <input name='uploadedImage' type='file' style={{display: 'none'}} onChange={e=>setAvatar(e.target.files[0])}/>
                </label>
                ):
            (<><a className='edit-btn' onClick={()=>{setEditting('')}}>Cancel</a><a type='submit' className='edit-btn' onClick={(e)=>{handleSave(e,'avatar')}}>Save</a></>)}
            </div>
        </form>
        <form className='info' onSubmit={e=>handleSave(e)}>
            <div className='editable'>
                <label>Username:</label>
                {editting === 'username'?(<input type='text' onChange={(e)=>{setUsername(e.target.value)}} placeholder={props.user.displayName}/>):(<span>{props.user.displayName}</span>)}
            </div>
            <div className='btn-box'>
            {editting !== 'username'?(<a className='edit-btn' onClick={()=>{setEditting('username')}}>Edit</a>):
            (<><a className='edit-btn' onClick={()=>{setEditting('')}}>Cancel</a><a type='submit' className='edit-btn' onClick={(e)=>{handleSave(e, 'username')}}>Save</a></>)}
            </div>
        </form>
        {
            props.user.type !== 'googleuser' &&
            <form className='info'>
                <div className='editable'>
                    <label>Password:</label>
                    {editting === 'password'?(<input type='text' onChange={(e)=>{setPassword(e.target.value)}}/>):(<span>hidden</span>)}
                </div>
                <div className='btn-box'>
                {editting !== 'password'?(<a className='edit-btn' onClick={()=>{setEditting('password')}}>Edit</a>):
                (<><a className='edit-btn' onClick={()=>{setEditting('')}}>Cancel</a><a type='submit' className='edit-btn' onClick={(e)=>{handleSave(e, 'password')}}>Save</a></>)}
                </div>
            </form>
        }
      </DetailsTab>
    </div>
  )
}

const DetailsTab = styled.div`
display: flex;
flex-direction: column;
align-items: center;
h2 {
    font-size: 60px;
    color: white;
    margin: 30px;
    margin-bottom: 30px;
    letter-spacing: 5px;
}
.info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    width: 100%;
    margin-bottom: 10px;
    transition: 0.2s ease-in-out;
    padding: 0 20px;
    &:hover {
        background-color: rgba(255,255,255,0.1);
    }
    .btn-box {
        a {
            font-weight: 600;
            color: rgba(255,255,255,0.8);
            margin-left: 5px;
            user-select: none;
            transition: 0.2s ease-in-out;
            &:hover {
                cursor: pointer ;
                color: rgba(255,255,255,1);
            }
        }
    }
    .editable {
        display: grid;
        grid-template-columns: 120px 1fr;
        label {
            font-weight: 700;

        }
        span {
            font-weight: 100;
        }
        input {
            border: none;
            background-color: rgba(255,255,255,0.1);
            height: 100%;
            width: 100%;
            padding: 2px 5px;
            border-radius: 3px;
            color: white;
            outline: none;
        }
        img {
            height: 200px;
            width: 200px;
            border-radius: 100%;
            object-fit: cover;
        }
    }
}
.avatar.info {
    height: fit-content;
}
`

export default EditDetails
