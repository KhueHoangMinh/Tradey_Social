import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

function EditDetails(props) {
    const [username,setUsername] = useState(props.user.displayName)
    const [email,setEmail] = useState(props.user.email)
    const [editting,setEditting] = useState('')
  return (
    <div>
      <DetailsTab>
        <h2>DETAILS</h2>
        <div className='info'>
            <div className='editable'>
                <label>Username:</label>
                {editting === 'username'?(<input type='text' onChange={(e)=>{setUsername(e.target.value)}}/>):(<span>{username}</span>)}
            </div>
            {editting !== 'username'?(<a className='edit-btn' onClick={()=>{setEditting('username')}}>Edit</a>):
            (<a className='edit-btn' onClick={()=>{setEditting('')}}>Save</a>)}
        </div>
        <div className='info'>
            <div className='editable'>
                <label>Email:</label>
                {editting === 'email'?(<input type='text' onChange={(e)=>{setEmail(e.target.value)}}/>):(<span>{email}</span>)}
            </div>
            {editting !== 'email'?(<a className='edit-btn' onClick={()=>{setEditting('email')}}>Edit</a>):
            (<a className='edit-btn' onClick={()=>{setEditting('')}}>Save</a>)}
        </div>
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
            background-color: rgba(255,255,255,0.3);
            height: 100%;
            border-radius: 5px;
            color: white;
        }
    }
}
`

export default EditDetails
