import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Item(props) {
  const navigate = useNavigate()

  const handleNav = () => {
    // console.log(props)
    navigate('/marketproduct',{state: {
      userId: props.userId,
      sellerId: props.sellerId,
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
        <div className='item-info'>
          
          <h3 className='more-details' onClick={handleNav}>MORE DETAILS</h3>
          <div className='user-detail'>
            <img src={props.userPhotoURL} alt=''/>
              <div>
                <h3>{props.userDisplayName}</h3>
                <span>{props.userEmail}</span>
                <span>{props.productTime}</span>
              </div>
          </div>
          <div className='item-detail'>
            <h3>{props.name}</h3>
            <p className='desc'>{props.description}</p>
            <span className='price'>{props.price}</span>
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
height: 500px;
display: flex;
flex-direction: column;
background-position-y: -100px;
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
  .user-detail {
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.6);

  div{
    display: flex;
    flex-direction: column;
    h3 {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
    }

    span {
      color: rgb(180,180,180);
      font-size: 13px;
    }
  }
  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
  .item-detail {
    width:100%;
    position: relative;
    height: fit-content;
    bottom: calc(-10% + 65px);
    display: flex;
    flex-direction: column;
    h3 {
      margin: 0;
    }
    .desc {
      line-height: 20px;
      height:60px;
      width: 100%;
      overflow: hidden;
      white-space: normal;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .price {
      color: rgb(51,255,51);
    }
  }
}

&:hover {
  transform: scale(1.03);
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
