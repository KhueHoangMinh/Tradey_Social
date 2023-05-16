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
import { Input } from './Input'


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
        Axios.post('/api/users/login', {email: username, password: password})
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
        Axios.post('/api/users/googlelogin', {email: result.user.email})
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
      <div class="login-bg">
          <div>
              <h1><span className='red'>Trade Trade</span> Trade <span className='blue'>Trade  </span> Trade
                  <span className='red'>Trade Trade</span> Trade <span className='blue'>Trade  </span> Trade&nbsp;
              </h1>
          </div>
          <div>
              <h1>buy <span className='red'>something</span> buy <span className='yellow'>something</span>
                  buy <span className='red'>something</span> buy <span className='yellow'>something</span>&nbsp;
              </h1>
          </div>
          <div>
              <h1>Let's go <span className='green'>stonkkk</span> Let's <span className='yellow'>stonkkk</span>
                  Let's go <span className='green'>stonkkk</span> Let's <span className='yellow'>stonkkk</span>&nbsp;
              </h1>
          </div>
          <div>
              <h1><span className='blue'>#TradingIsALifeStyle </span>#TradingIsALifeStyle
                  <span className='blue'>#TradingIsALifeStyle </span>#TradingIsALifeStyle&nbsp;</h1>
          </div>
          <div>
              <h1>$hopping <span className='green'> $hopping $hopping</span>  $hopping
                  $hopping <span className='green'> $hopping $hopping</span>  $hopping&nbsp;</h1>
          </div>
      </div>
        <LoginForm onSubmit={e=>handleLogin(e)}>
                <div className='logo-box'>
                    <img className='logo' src='/images/png/logo-no-background.png' alt=''/>
                    <h2>LOGIN</h2>
                </div>
                <div className='inputs'>
                    
                    <Input
                        type={'text'}
                        name={'username'}
                        value={username}
                        setValue={setUsername}
                        id={'username'}
                        label={'Email'}
                    />
                    <Input
                        type={'password'}
                        name={'password'}
                        value={password}
                        setValue={setPassword}
                        id={'password'}
                        label={'Password'}
                    />
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
background-color: rgb(30, 30, 30);
height: 100vh;
width: 100vw;
margin: 0;
padding: 0;
.login-bg {
    height: 100vh;
    width: 100vw;
    position: absolute;
    height: fit-content;
    width: fit-content;
    background-color: rgb(30, 30, 30);
    color: rgba(255,255,255,0.02);
    left: 0;
    z-index: 0;
    user-select: none;
    /* transform: rotate(10deg) rotateY(10deg); */
}

.login-bg div {
    position: relative;
    width: fit-content;
}

.login-bg h1 {
    position: relative;
    left: 0;
    white-space: nowrap;
    text-transform: uppercase;
    padding: 0 0;
    margin: 0 0;
}
.red {
    color: rgba(255,255,255,0.07);
}
.green {
    color: rgba(255,255,255,0.08);
}
.blue {
    color: rgba(255,255,255,0.03);
}
.yellow {
    color: rgba(255,255,255,0.1);
}

@keyframes text-move {
    0% {
        left: 0;
    }
    100% {
        left: -50%;
    }
}

.login-bg div:nth-child(1) h1{
    font-size: 10vh;
    line-height: 10vh;
    animation: text-move 10s infinite linear;
}

.login-bg div:nth-child(2) h1{
    font-size: 25vh;
    line-height: 25vh;
    animation: text-move 15s infinite linear;
}

.login-bg div:nth-child(3) h1{
    font-size: calc(40vh - 80px);
    line-height: calc(40vh - 80px);
    animation: text-move 25s infinite linear;
}

.login-bg div:nth-child(4) h1{
    font-size: 15vh;
    line-height: 15vh;
    animation: text-move 18s infinite linear;
}

.login-bg div:nth-child(5) h1{
    font-size: 10vh;
    line-height: 10vh;
    animation: text-move 10s infinite linear;
}
`

const LoginForm = styled.form`
color: rgb(200,200,200);
background-color: rgba(0,0,0,0.5);
padding: 30px;
padding-top: 0;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: fit-content;
overflow: hidden;
width: 30%;
min-width: 300px;
border-radius: 8px;
box-shadow: 5px 5px 15px rgba(0,0,0,0.6);
z-index:  1;
.logo-box {
    background-color: black;
    margin-bottom: 30px;
    padding: 20px;
    width: calc(100% + 40px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
        height: 80px;
        z-index: 1;
    }
    h2 {
        color: white;
        margin: 0;
        padding: 0;
        font-size: 40px;
        font-weight: 600;
        letter-spacing: 3px;
    }
}
.inputs {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 350px;
}

.login-btns {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 350px;
    margin: 15px 0px 25px 0;
    position: relative;
    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 50%;
        transition: 0.2s ease-in-out;
        font-weight: 700;
        font-size: 18px;
        border-radius: 8px;
        border: none;
        color: white;
        &:hover {
            cursor: pointer;
        }
    }
    .normal-login {
        background-color: rgba(255,255,255,0.3);
        color: white;
        margin-right: 20px;
        &:hover {
            background-color: rgb(255,255,255,0.9);
            color: black;
        }
    }
    .google-login {
        background-color: rgba(255,255,255,1);
        color: black;
        border: 1px solid white;
        img {
            width: 30px;
        }
        &:hover {
            background-color: rgb(255,255,255,0.1);
            color: white;
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
    .logo-box {
        flex-direction: column;
        justify-content: center;
        h2 {
            margin-top: 20px;
        }
    }
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
