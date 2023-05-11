import React from 'react'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { authActions } from '../store/auth-slice'
import { app } from '../firebase'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import Axios from 'axios'
import {useCookies} from 'react-cookie'


function Login() {
    const dispatch = useDispatch()
    const [username,setUsername] = useState()
    const [password,setPassword] = useState()
    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.user)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    const [errors,setErrors] = useState()
    const [storedUser, setStoredUser] = useCookies(['user'])

    const handleLogin = (e) => {
        e.preventDefault()
        Axios.post('/api/login', {email: username, password: password})
        .then(res=>{
            if(res.data.rows.length === 1) {
                const userData = {user_id: res.data.rows[0].user_id, type: res.data.rows[0].type, displayName: res.data.rows[0].name, email: res.data.rows[0].email, photoURL: res.data.rows[0].photourl}
                dispatch(authActions.login(userData))
                setStoredUser('User',userData,{path: '/'})
            } else {
                setErrors('no_match')
            }
        })
    }

  const handleGoogleLogin = () => {
    signInWithPopup(auth,provider).then((result)=>{
        Axios.post('/api/googlelogin', {email: result.user.email})
        .then(res=>{
            if(res.data.rows.length === 1) {
                const userData = {user_id: res.data.rows[0].user_id, type: res.data.rows[0].type, displayName: res.data.rows[0].name, email: res.data.rows[0].email, photoURL: res.data.rows[0].photourl}
                dispatch(authActions.login(userData))
                setStoredUser('User',userData,{path: '/'})
            } else {
                setErrors('no_account')
            }
        })
    })
  }

  const handleRegister = ()=> {
    navigate('/register')
  }

  useEffect(()=>{
    if(storedUser.User && storedUser.User !== 'null') {
      dispatch(authActions.login({user_id: storedUser.User.user_id, type: storedUser.User.type, displayName: storedUser.User.displayName, email: storedUser.User.email, photourl: storedUser.User.photoURL}))
      window.socket.emit('online')
    } else {
      setStoredUser('User',null,{path: '/'})
      dispatch(authActions.logout())
      navigate('/')
    }
  },[])
  
  useEffect(()=>{
    if(user) {
      navigate('/home')
    } else {
      navigate('/')
    }
},[user])


  return (
      <Container>
      <img className='logo' src='/images/png/logo-no-background.png' alt=''/>
        <LoginForm onSubmit={e=>handleLogin(e)}>
                <h2>LOGIN</h2>
                <div>
                    <label>Username:</label>
                    <input className='inputfield' type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                    <label>Password:</label>
                    <input className='inputfield' type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
                    {errors === 'no_match' ? <Error>Email or password does not match.</Error>:<></>}
                    {errors === 'no_account' ? <Error>No account with this email exists.</Error>:<></>}
                <div className='login-btns'>
                    <button className='normal-login' type='submit'>Login</button>
                    <button className='google-login' type='button' onClick={handleGoogleLogin}><img src='/images/google-logo.svg'/><span>Login with Google</span></button>
                </div>
                <span>Or <a onClick={handleRegister}>register</a> now.</span>
        </LoginForm>
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

const LoginForm = styled.form`
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

export default Login
