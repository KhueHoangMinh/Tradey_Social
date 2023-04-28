import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { authActions } from '../../store/auth-slice'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state=>state.auth.user)
    const [storedUser, setStoredUser] = useCookies(['user'])

    const handleLogout = () => {
        dispatch(authActions.logout())
        setStoredUser('User',null,{path: '/'})
        navigate('/')
    }

    
    useEffect(()=>{
        if(!user) {
          navigate('/')
        }
    },[user])
  return (
    <LogoutTab>
        <h2>LOG OUT</h2>
        <span>Are you sure that you want to log out?</span>
        <button onClick={handleLogout}>LOG OUT</button>
    </LogoutTab>
  )
}

const LogoutTab = styled.div`
display: flex;
flex-direction: column;
align-items: center;
h2 {
    font-size: 60px;
    color: red;
    margin: 30px;
    margin-bottom: 10px;
    letter-spacing: 5px;
}

span {
    color: rgb(200,200,200);
    font-size: 15px;
    font-weight: 100;
    margin-bottom: 30px;
}

button {
    width: 90%;
    background-color: rgba(255,0,0,0.6);
    color: rgb(230,230,230);
    padding: 8px;
    border-radius: 8px;
    font-size: 16px;
    letter-spacing: 2px;
    transition: 0.3s ease-in-out;
    &:hover {
        background-color: rgba(255,0,0,0.9);
    }
}
`

export default Logout
