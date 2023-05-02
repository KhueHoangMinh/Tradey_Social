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
    <div>
        <Panel>
            {
              loading == 1 ? (advertisement.map((ad)=>(
                <a className='advertisement' href={ad.link}><img src={ad.image} alt=''/></a>
              ))) : <Loading></Loading>
            }
        </Panel>
    </div>
  )
}

const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
padding: 30px;
position: fixed;
width: calc(25% - 80px);
height: fit-content;
max-height: calc(100vh - 180px);
display: flex;
flex-direction: column;
align-items: center;
overflow-y: hidden scroll;
overflow-x: hidden;
img {
  width: calc(100% + 60px);
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.6);
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
