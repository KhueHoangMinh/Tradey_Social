import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
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

function About() {
    const [active,setActive] = useState('logout')
    const user = useSelector(state=>state.auth.user)
    const navigate = useNavigate()
    useEffect(()=>{
      if(!user) {
        navigate('/')
      }
    },[])

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
            case 'logout':
                return (<Logout/>)
            default:
                return (<Logout/>)
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
                <a onClick={()=>{setActive('editDetails')}}>Edit details</a>
                <a onClick={()=>{setActive('posts')}}>Your posts</a>
                {user ? (user.type != 'admin' && <a onClick={()=>{setActive('shop')}}>Your shop</a>):""}
                {user ? (user.type === 'admin' && <a onClick={()=>{setActive('adminshop')}}>Shop</a>):""}
                {user ? (user.type === 'admin' && <a onClick={()=>{setActive('advertisement')}}>Advertisement</a>):""}
                <a onClick={()=>{
                    if(user.type === 'admin') {
                        setActive('adminrequest')
                    } else {
                        setActive('request')
                    }
                }}>Order requests</a>
                {user ? (user.type != 'admin' && <a onClick={()=>{setActive('cart')}}>Your cart</a>):""}
                {user ? (user.type != 'admin' && <a onClick={()=>{setActive('history')}}>Shopping history</a>):""}
            </div>
            <a className='logout' onClick={()=>{setActive('logout')}}>Log out</a>
        </Tabs>
    </LeftSide>
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
border-bottom: 1px solid rgba(255,255,255,0.2);
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
        &:hover, .active {
            background-color: rgba(255,255,255,0.2);
        }
    }
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}
.logout {
    position: relative;
    bottom: 0;
    color: red;
    padding: 5px 10px;
    background-color: rgba(255,0,0,0.1);
    &:hover, .active {
        background-color: rgba(255,0,0,0.2);
    }
}
`

export default About
