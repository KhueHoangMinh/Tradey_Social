import Axios from 'axios'
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function Item(props) {
  const [editting, setEditting] = useState(false)
  const [name,setName]= useState()    
  const [description,setDescription]= useState()    
  const [price,setPrice]= useState()    
  const [image,setImage]= useState()  

  
  const navigate = useNavigate()

  const handleNav = () => {
    navigate('/marketproduct',{state: {
      productId: props.productId,
      type: props.type
    }})
  }


  const handleCancel = () => {
    setEditting(false)
    setName(null)
    setDescription(null)
    setPrice(null)
    setImage(null)
  }

  const handleDelete = () => {
    Axios.post('/api/deleteproduct',{productId: props.productId})
  }
  
  
  const handleSave = () => {
    var lastSlash = props.productImage.length - 1
    var imageName = ''
    for(let i = lastSlash; i >= 0; i--) {
      if(props.productImage[i] === '/') {
        lastSlash = i;
        break
      }
    }
    for(let i = lastSlash + 1; i < props.productImage.length; i++) {
      imageName = imageName + props.productImage[i]
    }
    Axios.post('/api/updateproduct',{
      productId: props.productId,
      name: name,
      description: description,
      price: price,
      imagePath: imageName,
      image: image,
    },{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  return (
      <ItemPanel>
        <div className='product-info'>
          <img className='product-image' src={image && editting?URL.createObjectURL(image):props.productImage} alt=''/>
          <img className='background-image' src={window.host + props.productImage} alt=''/>
          <div className='left-info'>
            <div className='info'>
              {!editting ? (<h2 onClick={handleNav} className='name'>{name?name:props.productName}</h2>):(<input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>)}
            </div>
            <div className='info'>
              {!editting ? (<span className='desc'>{description?description:props.productDescription}</span>):(<input type='text' value={description} onChange={(e)=>setDescription(e.target.value)}/>)}
            </div>
            <div className='info'>
              {!editting ? (<span className='price'>${price?price:props.productPrice}</span>):(<input type='number' value={price} onChange={(e)=>setPrice(e.target.value)}/>)}
            </div>
            {props.type != 3 && props.type != 4 ? 
            (
              <div className='info'>
                {!editting ? (<span className='image'>{props.productImage}</span>):(<input type='file' onChange={(e)=>setImage(e.target.files[0])}/>)}
              </div>
            )
            :
            (
              <div className='quantity'>
                {props.type == 3 ? <button className='quant-btn'>-</button> : ''}
                x{props.quantity ? props.quantity : 'NaN'}
                {props.type == 3 ? <button className='quant-btn'>+</button> : ''}
              </div>
            )
          }
          </div>
        </div>
        <div>
          {props.type !== 3 && props.type !== 4 ? 
            (editting ? (
                <>
                  <a className='edit-btn' onClick={()=>handleCancel()}>Cancel</a>
                  <a className='edit-btn' onClick={handleSave}>Save</a>
                </>
              ):(
                <>
                  <a className='edit-btn' onClick={handleDelete}>Delete</a>
                  <a className='edit-btn' onClick={()=>setEditting(true)}>Edit</a>
                </>
            )
            )
            :''
          }
        </div>
      </ItemPanel>
    )
  }
  
  const ItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  height: 150px;
  width: calc(100%);
  justify-content: space-between;
  background-color: rgba(255,255,255,0.2);
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
  color: white;
  .product-info {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    z-index: 1;
    .product-image {
      height: 100%;
      width: 150px;
      object-fit: cover;
      box-shadow: 5px 0px 20px rgba(0,0,0,0.6);
    }
    .background-image {
      width: 250%;
      height: 250%;
      top: -50%;
      left: -50%;
      position: absolute;
      object-fit: cover;
      filter: blur(15px) brightness(0.3);
      z-index: -1;
    }
    .left-info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
      overflow-x: hidden;
      .quantity {
        padding: 10px 5px;
        background-color: black;
        color: white;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 12px;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
        display: flex;
        .quant-btn {
          margin: 0 5px;
          width: 18px;
          height: 18px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 500;
          background-color: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 3px;
          transition: 0.2s ease-in-out;
          &:hover {
            background-color: white;
            color: black;
          }
        }
      }
      .info {
        position: relative;
        h2 {
          padding: 0;
          margin: 0;
          margin-bottom: 5px;
          color: rgba(255,255,255,0.8);
          transition: 0.2s ease-in-out;
          &:hover {
            cursor: pointer;
            color: rgba(255,255,255,1);
          }
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
        input {
            border: none;
            background-color: rgba(255,255,255,0.3);
            height: 100%;
            border-radius: 5px;
            color: white;
        }
      }
    }
  }

  .edit-btn {
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    transition: 0.2s ease-in-out;
    height: 30px;
    width: 40px;
    margin-left: 20px;
    &:hover {
      color: rgba(255,255,255,1);
      cursor: default;
    }
  }
  `

export default Item
