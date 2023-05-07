import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Loading from '../Loading'

function RightSide() {
  const [advertisement, setAdvertisement] = useState([])
  const [loading,setLoading] = useState(0)
  useEffect(()=>{
    Axios.post('/api/getadvertisement')
    .then(res=> {
      setAdvertisement(res.data)
      setLoading(1)
    })
  },[])
  return (
    <Panel>
        {
          loading == 1 ? (advertisement.map((ad)=>(
            <a className='advertisement' href={ad.link}><img src={ad.image} alt=''/></a>
          ))) : <Loading></Loading>
        }
    </Panel>
  )
}

const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 15px rgba(0,0,0,0.6);
padding: 20px;
margin-left: -20px;
position: relative;
width: calc(100% - 40px);
height: fit-content;
max-height: calc(100vh - 160px);
display: flex;
flex-direction: column;
align-items: center;
overflow-y: scroll;
overflow-x: visible;
::-webkit-scrollbar {
  display: none;
}
img {
  width: calc(100%);
  height: 250px;
  margin-bottom: 25px;
  border-radius: 10px;
  object-fit: cover;
}
.advertisement {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 1200px) {
  display: none;
}
`

export default RightSide
