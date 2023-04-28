import Axios from 'axios'
import React, {useState} from 'react'
import styled from 'styled-components'

function Item(props) {
  const [editting, setEditting] = useState(false)
  const [name,setName]= useState()    
  const [description,setDescription]= useState()    
  const [price,setPrice]= useState()    
  const [image,setImage]= useState()  


  const handleCancel = () => {
    setEditting(false)
    setName(null)
    setDescription(null)
    setPrice(null)
    setImage(null)
  }

  const handleDelete = () => {
    Axios.post('/api/delete'+(props.type === 0 ? 'shop':'market')+'product',{productId: props.productId})
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
    Axios.post('/api/update'+(props.type === 0 ? 'shop':'market')+'product',{
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
          <img src={image && editting?URL.createObjectURL(image):props.productImage} alt=''/>
          <div className='left-info'>
            <div className='info'>
              <label>Name:</label>
              {!editting ? (<span className='name'>{name?name:props.productName}</span>):(<input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>)}
            </div>
            <div className='info'>
              <label>Description:</label>
              {!editting ? (<span className='desc'>{description?description:props.productDescription}</span>):(<input type='text' value={description} onChange={(e)=>setDescription(e.target.value)}/>)}
            </div>
            <div className='info'>
              <label>Price:</label>
              {!editting ? (<span className='price'>${price?price:props.productPrice}</span>):(<input type='number' value={price} onChange={(e)=>setPrice(e.target.value)}/>)}
            </div>
            {props.type != 3 && props.type != 4 ? 
            (
              <div className='info'>
                <label>Image:</label>
                {!editting ? (<span className='image'>{props.productImage}</span>):(<input type='file' onChange={(e)=>setImage(e.target.files[0])}/>)}
              </div>
            )
            :
            (
              <div className='info'>
                <label>Quantity:</label>
                {props.quantity ? props.quantity : 'NaN'}
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
  height: 120px;
  width: calc(100% - 20px);
  justify-content: space-between;
  background-color: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  .product-info {
    display: flex;
    flex-direction: row;
    img {
      height: 100%;
      width: 120px;
      object-fit: cover;
    }
    .left-info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 0px;
      overflow-x: hidden;
      .info {
        display: grid;
        grid-template-columns: 110px 1fr;
        label {
          font-weight: 600;
        }
        span {
          overflow: hidden;
          white-space: normal;
          display: -webkit-box;
          /* -webkit-box-clamp: 1;
          -webkit-box-orient: vertical; */
          text-overflow: ellipsis;
          &:hover {
          }
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
