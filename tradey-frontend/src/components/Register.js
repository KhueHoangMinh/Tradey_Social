import React from 'react'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { authActions } from '../store/auth-slice'
import { app } from '../firebase'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import Axios from 'axios'


function Register() {
    const dispatch = useDispatch()
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [photoURL,setPhotoURL] = useState(null)
    const [password,setPassword] = useState()
    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.user)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    const [errors, setErrors] = useState()

    const handleRegister = () => {
        Axios.post('/api/register', {type: "user", name: username, email: email, photoURL: photoURL, password: password})
        .then(res=>{
            if(res.data == 'existed') {
                setErrors('existed')
            } else {
                navigate('/')
            }
        })
    }

  const handleGoogleRegister = () => {
    signInWithPopup(auth,provider).then((result)=>{
        Axios.post('/api/register', {type: "googleuser", name: result.user.displayName, email: result.user.email, photoURL: result.user.photoURL, password: 'google'})
        .then(res=>{
            if(res.data == 'existed') {
                setErrors('existed')
            } else {
                navigate('/')
            }
        })
    })
  }

  const handleLogin = ()=> {
    navigate('/')
  }

  useEffect(()=>{
    console.log(user)
  },[user])
  return (
      <Container>
      <img className='logo' src='/images/png/logo-no-background.png' alt=''/>
            <RegisterForm>
                    <h2>Register</h2>
                    <div>
                        <label>Username:</label>
                        <input className='inputfield' type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                        <label>Email:</label>
                        <input className='inputfield' type='text' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        <label>Password:</label>
                        <input className='inputfield' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                    </div>
                    {errors == 'existed' ? <Error>An account with this email already existed, please loggin.</Error>:<></>}
                    <div className='login-btns'>
                        <button className='normal-login' onClick={handleRegister}>Register</button>
                        <button className='google-login' onClick={handleGoogleRegister}><img src='/images/google-logo.svg'/><span>Register with Google</span></button>
                    </div>
                    <span>Or <a onClick={handleLogin}>login</a> now.</span>
            </RegisterForm>
      </Container>
  )
}

const Container = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-image: radial-gradient(farthest-corner at 75% 70%, rgba(55,55,55,1), rgba(0,0,0,1));
height: 100vh;
width: 100vw;
margin: 0;
padding: 0;
.logo {
    height: 100px;
    margin:30px;
}
`

const RegisterForm = styled.div`
color: rgb(200,200,200);
background-color: rgba(200,200,200,0.2);
padding: 30px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: fit-content;
width: 30%;
border-radius: 8px;
box-shadow: 5px 5px 15px rgba(0,0,0,0.6);
div {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 350px;
    label {
        font-weight: 100;
        margin-bottom: 5px;
    }
    input {
        width: 100%;
        height: 30px;
        background-image: none;
        background-color: rgb(50,50,50);
        margin-bottom: 15px;
        border: 1px transparent;
        border-radius: 2px;
        color: rgb(200,200,200);

        &:focus {
            background-color: rgb(80,80,80);
            border: 1px rgba(51,255,255,1);
        }
    }
}
h2 {
    color: rgba(51,255,255,1);
    margin: 0;
    padding: 0;
    padding-bottom: 20px;
    font-size: 40px;
    font-weight: 600;
    letter-spacing: 3px;
}

.login-btns {
    display: flex;
    flex-direction: row;
    margin: 15px 0px 25px 0;
    .normal-login {
        height: 40px;
        width: 50%;
        margin-right: 20px;
        background-color: rgba(51,255,255,0.5);
        transition: 0.2s ease-in-out;
        font-weight: 500;
        border-radius: 3px;
        border: none;
        color: white;
        font-weight: 600;
        &:hover {
            background-color: rgb(51,255,255,0.9);
        }
    }
    .google-login {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 50%;
        background-color: rgba(255,255,255,0.9);
        transition: 0.2s ease-in-out;
        font-weight: 500;
        border-radius: 3px;
        border: none;
        color: black;
        font-weight: 600;
        img {
            width: 30px;
        }
        &:hover {
            background-color: rgb(255,255,255,1);
        }
    }
}

span {
    font-size: 12px;
    a {
        color: rgb(210,210,210);
        text-decoration: none;
        transition: 0.2s ease-in-out;
        &:hover {
            cursor: pointer;
            color: rgb(250,250,250);
        }
    }
}
@media (max-width: 1200px) {
    .login-btns {
        flex-direction: column;
        .normal-login {
            width: 100%;
            margin: 0;
            margin-bottom: 20px;
        }
        .google-login {
            width: 100%;
        }
    }
}
`
const Error = styled.p`
margin: 5px 0;
padding: 0;
color: red;
`

export default Register
