import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import LeftSide from './home-components/LeftSide'
import Main from './home-components/Main'
import RightSide from './home-components/RightSide'

function Home() {
  const user = useSelector(state=>state.auth.user)
  const navigate = useNavigate()
  return (
    <div>
      <HomePage>
        <LeftSide user={user}/>
        <Main user={user}/>
        <RightSide/>
      </HomePage>
    </div>
  )
}

const HomePage = styled.div`
position: relative;
display: grid;
grid-template-columns: 1fr 2fr 1fr;
padding: 20px 0;
margin-top: 80px;
transition: 0.2s;
background-image: radial-gradient(farthest-corner at 75% 70%, rgb(20,20,20), rgb(25,25,25));
height: calc(100vh - 120px);
width: 100vw;
color: rgb(230,230,230);
@media (max-width: 1200px) {
  display: flex;
  flex-direction: column;
  height: fit-content;
}
`

export default Home

