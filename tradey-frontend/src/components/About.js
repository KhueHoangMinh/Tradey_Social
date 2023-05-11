import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { authActions } from '../store/auth-slice'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Logout from './about-component/Logout'
import EditDetails from './about-component/EditDetails'
import Posts from './about-component/Posts'
import Shop from './about-component/Shop'
import AdminShop from './about-component/AdminShop'
import Request from './about-component/Request'
import Cart from './about-component/Cart'
import History from './about-component/History'
import Advertisement from './about-component/Advertisement'
import AdminRequest from './about-component/AdminRequest'
import { Link } from 'react-router-dom'
import PopUp from './PopUp'


function About() {
    const [active,setActive] = useState('logout')
    const dispatch = useDispatch()
    const user = useSelector(state=>state.auth.user)
    const [storedUser, setStoredUser] = useCookies(['user'])
    const [logOutConfirm,setLogOutConfirm] = useState(false)
    const navigate = useNavigate()
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

    const caseByActive = () => {
        switch(active) {
            case 'editDetails':
                return (<EditDetails user={user}/>)
            case 'posts':
                return (<Posts user={user}/>)
            case 'shop':
                return (<Shop user={user}/>)
            case 'adminshop':
                return (<AdminShop user={user}/>)
            case 'adminrequest':
                return (<AdminRequest user={user}/>)
            case 'request':
                return (<Request user={user}/>)
            case 'cart':
                return (<Cart user={user}/>)
            case 'history':
                return (<History user={user}/>)
            case 'advertisement':
                return (<Advertisement user={user}/>)
            default:
                return (<Shop user={user}/>)
        }
    }
  return (
    <AboutPage>
    <LeftSide>
        <UserInfo>
            <img src={user ? (user.photoURL ? user.photoURL : '/images/user.png') : '/images/user.png'} alt=''/>
            <h3>{user? user.displayName: 'user'}</h3>
            <span>{user? user.email: 'useremail'}</span>    
        </UserInfo>
        <Tabs>
            <div className='buttons'>
                <a className={active == 'editDetails' ? 'active': ''} onClick={()=>{setActive('editDetails')}}>Edit details</a>
                <a className={active == 'posts' ? 'active': ''} onClick={()=>{setActive('posts')}}>Your posts</a>
                {user ? (user.type !== 'admin' && <a className={active == 'shop' ? 'active': ''} onClick={()=>{setActive('shop')}}>Your shop</a>):""}
                {user ? (user.type === 'admin' && <a className={active == 'adminShop' ? 'active': ''} onClick={()=>{setActive('adminshop')}}>Shop</a>):""}
                {user ? (user.type === 'admin' && <a className={active == 'advertisement' ? 'active': ''} onClick={()=>{setActive('advertisement')}}>Advertisement</a>):""}
                <a className={active == 'request' || active == 'adminrequest' ? 'active': ''} onClick={()=>{
                    if(user.type === 'admin') {
                        setActive('adminrequest')
                    } else {
                        setActive('request')
                    }
                }}>Order requests</a>
                {user ? (user.type !== 'admin' && <a className={active == 'cart' ? 'active': ''} onClick={()=>{setActive('cart')}}>Your cart</a>):""}
                {user ? (user.type !== 'admin' && <a className={active == 'history' ? 'active': ''} onClick={()=>{setActive('history')}}>Shopping history</a>):""}
            </div>
            <a className='logout' onClick={()=>{setLogOutConfirm(true)}}>Log out</a>
        </Tabs>
    </LeftSide>
    {
        logOutConfirm && 
        <PopUp
            close = {()=>setLogOutConfirm(false)}
            content = {
                <LogoutTab>
                    <p>Are you sure that you want to log out?</p>
                    <button onClick={()=>{handleLogout()}}>LOG OUT</button>
                    <button className='stay' onClick={()=>{setLogOutConfirm(false)}}>STAY</button>
                </LogoutTab>
            }
        />
    }
    {
        active === 'posts'?(
            <>{caseByActive()}</>
        )
        :(
            <RightSide>
                {caseByActive()}
            </RightSide>)
    }
    </AboutPage>
  )
}

const LogoutTab = styled.div`
display: flex;
flex-direction: column;
align-items: center;

button {
    width: 90%;
    background-color: rgba(255,0,0,0.6);
    color: rgb(230,230,230);
    padding: 8px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 2px;
    margin-bottom: 20px;
    border: none;
    box-shadow: 5px 5px 8px rgba(0,0,0,0.6);
    transition: 0.3s ease-in-out;
    &:hover {
        cursor: pointer;
        background-color: rgba(255,0,0,0.9);
    }
}

.stay {
    background-color: rgba(255,255,255,0.3);
    color: white;
    border: 1px solid rgba(255,255,255,0.6);
    &:hover {
        background-color: white;
        color: black;
    }
}
`

const AboutPage = styled.div`
position: relative;
display: grid;
grid-template-columns: 350px 1fr;
gap: 20px;
margin-top: 80px;
padding: 20px;
background-image: radial-gradient(farthest-corner at 75% 70%, rgb(20,20,20), rgb(25,25,25));
height: calc(100vh - 120px);
color: rgb(230,230,230);
.posts {
    position: relative;
    height: 100%;
    padding: 0 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    ::-webkit-scrollbar {
    display: none;
    }
}
@media (max-width: 1200px) {
  display: flex;
  flex-direction: column;
  padding: 20px 5%;
}
`

const LeftSide = styled.div`
display: flex;
flex-direction: column;
position: relative;
width: 100%;
height: calc(100vh - 120px);
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 15px rgba(0,0,0,0.6);
@media (max-width: 1200px) {
  position: relative;
  width: calc(100%);
}
`

const RightSide = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 15px rgba(0,0,0,0.6);
padding: 20px;
height: calc(100% - 40px);
overflow-y: scroll;
overflow-x: hidden;
::-webkit-scrollbar {
  display: none;
}
`

const UserInfo = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
height: 35%;
img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    padding: 10px 0;
}

h3 {
    padding: 5px 0;
    margin: 0;
}
`

const Tabs = styled.div`
padding: 20px 0;
display: flex;
flex-direction: column;
.buttons {
    a {
        padding: 5px 10px;
        background-color: rgba(255,255,255,0.1);
        transition: 0.2s ease-in-out;
        user-select: none;
        &:hover, .active {
            cursor: pointer;
            background-color: rgba(255,255,255,0.2);
        }
    }
    a.active {
        background-color: rgba(255,255,255,0.2);
    }
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding-bottom: 20px;
}
.logout {
    position: relative;
    bottom: 0;
    color: red;
    padding: 5px 10px;
    background-color: rgba(255,0,0,0.1);
    &:hover, .active {
        cursor: pointer;
        background-color: rgba(255,0,0,0.2);
    }
}
.logout.active {
    background-color: rgba(255,0,0,0.2);
}
`

export default About
