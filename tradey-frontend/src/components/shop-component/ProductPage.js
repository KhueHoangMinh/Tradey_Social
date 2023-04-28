import React from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import { useLocation } from 'react-router-dom'

function ProductPage() {
  const {state} = useLocation()

  const handleAdd = () => {
    Axios.post('/api/addtocart', {userId: state.userId, productId: state.productId, action: 'add',type: 'shop'})
    .then(res=>{
      console.log(res)
    })
  }
  return (
    <div>
      <Container>
        <img src={state.image} alt=''/>
        <LeftColumn>
            <div className='info'>
                <h2>{state.name}</h2>
                <p>{state.description}</p>
                <span>${state.price}</span>
            </div>
            <button onClick={handleAdd}>Add to cart</button>
        </LeftColumn>
      </Container>
    </div>
  )
}

const Container = styled.div`
position: relative;
display: grid;
grid-template-columns: 1fr 1fr;
padding: 20px;
gap: 20px;
top: 80px;
background-image: radial-gradient(farthest-corner at 75% 70%, rgb(20,20,20), rgb(25,25,25));
min-height: calc(100vh - 80px);
height: fit-content;
color: rgb(230,230,230);
img {
    height: calc(100vh - 120px);
    width: 100%;
    object-fit: cover;
}
@media (max-width: 1200px) {
  display: flex;
  flex-direction: column;
}
`

const LeftColumn = styled.div`
display: flex;
flex-direction: column;
.info {
    margin-bottom: 20px;
    p {
        height: fit-content;
        max-height: 500px;
    }
    span {
        color: rgba(51,255,51,1);
    }
}
button {
    width: fit-content;
    padding: 5px 20px;
    margin: 0 auto;
    color: white;
    font-weight: 600;
    font-size: 20px;
    background-color: rgba(51,255,255,0.5);
    border-radius: 5px;
    border: none;
    transition: 0.2s ease-in-out;
    &:hover {
        background-color: rgba(51,255,255,0.8);
    }
}
`

export default ProductPage
