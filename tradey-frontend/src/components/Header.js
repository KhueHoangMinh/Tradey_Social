import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useCookies } from 'react-cookie'
import { authActions } from '../store/auth-slice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [active, setActive] = useState('home')
  const [expandNav,setExpandNav] = useState(false)
  const user = useSelector(state=>state.auth.user)
  const [storedUser, setStoredUser] = useCookies(['user'])
  
  useEffect(()=>{
    if(!user || user === null || storedUser.User === 'null') {
      navigate('/')
    } else {
      if(storedUser.User && storedUser.User !== 'null') {
        dispatch(authActions.login({user_id: storedUser.User.user_id, type: storedUser.User.type, displayName: storedUser.User.displayName, email: storedUser.User.email, photoURL: storedUser.User.photoURL}))
      } else {
        dispatch(authActions.logout())
        setStoredUser('User',null,{path: '/'})
      }
    }
  },[])

  useEffect(()=>{
    if(user) {
      window.socket.on('receivenotification', (req) => {
        if(req.receiverIds.includes(user.user_id)) {
          if(req.type == 'message') {
            var audio = document.getElementById('message-noti');
            audio.play();
          }
        }
      })
    }
  },[window.socket])

  const handleUserInfo = () => {
    setActive('about')
    if(expandNav) {
      setExpandNav(!expandNav)
    }
    navigate('/about');
  }

  const handleHome = () => {
    setActive('home')
    if(expandNav) {
      setExpandNav(!expandNav)
    }
    navigate('/home');
  }

  const handleMarket = () => {
    setActive('market')
    if(expandNav) {
      setExpandNav(!expandNav)
    }
    navigate('/market');
  }

  return (
    <div>
      <HeaderBar>
        <audio id='message-noti' src='/audio/message-noti.mp3' autoPlay='false' style={{display: "none"}}/>
        <Logo>
          <img src='/images/png/logo-no-background.png' alt=''/>
        </Logo>
        <Nav>
          <img className='menu-bars' src='/images/menu.svg' onClick={()=>setExpandNav(!expandNav)} alt=''/>
          <div className='nav-items' style=
          {expandNav ? ({right: '0'}):({right: '-50vw'})}
          >
            <NavItem onClick={handleHome} className={active==='home'?'active':''}>
              <a><span>HOME</span></a>
            </NavItem>
            <NavItem onClick={handleMarket} className={active==='market'?'active':''}>
              <a><span>MARKET</span></a>
            </NavItem>
            
            <UserInfo onClick={handleUserInfo} className={active==='about'?'active':''}>
              <img src={user? (user.photoURL ? (user.photoURL):('/images/user.png')):'/images/user.png'} alt=''/>
              <div className='info'>
                <span>Hello, {user ? user.displayName : 'Customer'}!</span>
              </div>
            </UserInfo>
          </div>
        </Nav>
      </HeaderBar>
    </div>
  )
}

const HeaderBar = styled.div`
position: fixed;
top: 0;
right: 0;
left: 0;
height: 80px;
background-color: rgb(10,10,10);
color: rgba(230,230,230);
display: flex;
flex-direction: row;
justify-content: space-between;
box-shadow: 0 0px 20px black;
z-index: 100;
`

const Logo = styled.div`
height: 100%;
display: flex;
align-items: center;
justify-content: center;
padding: 0 20px;
img {
  height: 80%;
  filter: contrast(10%);
}
`

const Nav = styled.div`
display: flex;
flex-direction: row;
padding: 0 20px;
align-items: center;
justify-content: center;
.menu-bars {
  width: 25px;
  display: none;
}
.nav-items {
  display: flex;
  flex-direction: row;
transition: 0.2s ease-in-out;
}
.before-uf {
  border-right: 2px solid rgba(255,255,255,0.2);
}
.active {
  background-color: rgba(255,255,255,0.2);
  cursor: default;
  a::after {
    width: 100%; 
    left: 0; 
  }
}
@media (max-width: 1200px) {
  flex-direction: column;
  .nav-items {
    position: absolute;
    flex-direction: column;
    top: 80px;
    right: 0px;
    padding-right: 40px;
    height: calc(100vh - 80px);
    width: 40vw;
    background-color: rgb(10,10,10);
  }
  .menu-bars {
    display: block;
    z-index: 101;
  }
  .before-uf {
    border-right:none;
  }
}
`

const NavItem = styled.div`
height: 80px;
width: fit-content;
display: flex;
align-items: center;
justify-content: center;
padding: 0 20px;
transition: 0.2s ease-in-out;
border-bottom: 0px solid rgb(230,230,230);
a {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: -5px;
  margin-right: -5px;
  span {
    letter-spacing: 5px;
    text-align: center;
    padding: 2px 5px;
  }
}
a::after {  
  background: none repeat scroll 0 0 transparent;
  bottom: 0;
  content: "";
  display: block;
  height: 2px;
  left: 50%;
  position: inherit;
  background: rgb(230,230,230);
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
  margin-right: 5px;
}
&:hover {
  background-color: rgba(255,255,255,0.2);
  cursor: default;
  a::after {
    width: calc(100% + 5px); 
    left: 0; 
  }
}
@media (max-width: 1200px) {
  height: 100%;
  width: 100%;
}
`

const UserInfo = styled.a`
height: 80px;
width: 120px;
padding: 0 20px;
transition: 0.2s ease-in-out;
border-bottom: 0px solid rgb(230,230,230);
letter-spacing: 5px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;

&:hover {
  background-color: rgba(255,255,255,0.2);
  cursor: default;
}
img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
}

.info {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  span {
    font-size: 12px;
    letter-spacing: 2px;
  }
  img {
    height: 20px;
    bottom: 5px;
  }
}
@media (max-width: 1200px) {
  height: 100%;
  width: 100%;
}
`

export default Header
