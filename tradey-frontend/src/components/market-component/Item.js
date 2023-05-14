import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Item(props) {
  const navigate = useNavigate()

  const handleNav = () => {
    navigate('/marketproduct',{state: {
      productId: props.productId,
      type: props.type
    }})

  }
  
  return (
    <div>
      <ItemPanel onClick={()=>handleNav()}>
        <div className='item-info'>
          <div className='item-top'>
            {
              props.type === 'shop' ? (
                <div className='admin-product'>
                  Admin
                </div>
              ) : ''
            }
            <img className='item-image' src={window.host + props.image} alt=''/>
            <div className='user-detail'>
              <img src={props.userPhotoURL ? (window.host + props.userPhotoURL) : '/images/user.png'} alt=''/>
                <div>
                  <h3>{props.userDisplayName}</h3>
                  <span>{props.userEmail}</span>
                  <span>{props.productTime}</span>
                </div>
            </div>
          </div>
          <div className='item-detail'>
            <h3>{props.name}</h3>
            <p className='desc'>{props.description}</p>
            <span className='price'>$ {props.price}</span>
          </div>
        </div>
      </ItemPanel>
    </div>
  )
}

const ItemPanel = styled.div`
border-radius: 10px;
overflow: hidden;
width: 100%;
display: flex;
flex-direction: column;
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
transition: 0.2s ease-in-out;
position: relative;
color: white;
.item-info {
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  .item-top {
    position: relative;
    width: 100%;
    overflow: hidden;
    &::after {
      padding-top: 60%;
      display: block;
      content: "";
    }
    .admin-product {
      padding: 15px;
      font-size: 18px;
      font-weight: 600;
      border-radius: 0 0 0 10px;
      background-color: black;
      color: white;
      box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
    }
    .item-image {
      position: absolute;
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: 0.2s ease-in-out;
      z-index: 1;
    }
    .user-detail {
      position: absolute;
      display: flex;
      flex-direction: row;
      bottom: unset;
      bottom: -100%;
      padding: 20px;
      z-index: 2;
      width: 100%;
      transition: 0.2s ease-in-out;
      background: linear-gradient(0deg, rgba(10,10,10,1), rgba(10,10,10,0.8),rgba(0,0,0,0));

      div{
        display: flex;
        flex-direction: column;
        h3 {
          padding: 0;
          margin: 0;
          margin-bottom: 1px;
          text-decoration: none;
          color: rgba(255,255,255,0.9);
          transition: 0.2s ease-in-out;
          z-index: 1;
          &:hover {
            color: rgba(255,255,255,1);
          }
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
        position: relative;
      }
    }
  }
  .item-detail {
    width: calc(100% - 40px);
    position: relative;
    height: 120px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background-color: rgb(10,10,10);
    h3 {
      margin: 0;
    }
    .desc {
      text-align: justify;
      line-height: 20px;
      height: 40px;
      width: 100%;
      overflow: hidden;
      white-space: normal;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .price {
      font-weight: 600;
      color: lightgreen;
    }
  }
}

&:hover {
  .item-top {
    .item-image {
      transform: scale(1.1);
    }
    .user-detail {
      bottom: 0;
    }
  }
  cursor: pointer;
}
`

export default Item
