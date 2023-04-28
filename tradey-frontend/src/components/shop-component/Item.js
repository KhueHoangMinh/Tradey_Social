import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Item(props) {
  const navigate = useNavigate()

  const handleNav = () => {
    navigate('/shopproduct',{state: {
      userId: props.userId,
      productId: props.productId,
      image: props.image,
      name: props.name,
      description: props.description,
      price: props.price
    }})
  }
  return (
    <div>
      <ItemPanel style={{backgroundImage: `url(${props.image})`}}>
        {/* <img src='/images/item-image.jpeg' alt=''/> */}
        <div className='item-info'>
          
          <h3 className='more-details' onClick={handleNav}>MORE DETAILS</h3>
          <div>
            <h3>{props.name}</h3>
            <p>{props.description}</p>
            <span>${props.price}</span>
          </div>
        </div>
      </ItemPanel>
    </div>
  )
}

const ItemPanel = styled.div`
background-color: rgb(200,200,200);
border-radius: 30px;
width: 100%;
height: 300px;
display: flex;
flex-direction: column;
background-position-y: -80px;
background-size: cover;
transition: 0.2s ease-in-out;
.item-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0px 10px;
  border-radius: 30px;
  overflow: hidden;
  background-image: linear-gradient(0deg,rgba(0,0,0,1) 30%,transparent);
  background-color: transparent;
  transition: 0.2s ease-in-out;
  
  .more-details {
    position: relative;
    height: 0;
    margin: auto auto;
    color: transparent;
    letter-spacing: 2px;
  }
  div {
    position: relative;
    height: fit-content;
    bottom: calc(-15% + 65px);
    h3 {
        margin: 0;
        margin-bottom: 5px;
    }
    p {
      line-height: 15px;
      height: 30px;
      width: 100%;
      overflow: hidden;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }
    span {
      color: rgb(51,255,51);
    }
  }
}

&:hover {
  transform: scale(1.05);
  .item-info {
    background-color: rgb(0,0,0,0.6);
    .more-details {
      color: white;
    }
  }
  cursor: default;
}
`

export default Item
