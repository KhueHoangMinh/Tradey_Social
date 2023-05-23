import Axios from 'axios'
import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PopUp from '../PopUp'

function Item(props) {
  const [editting, setEditting] = useState(false)
  const [name,setName]= useState()    
  const [description,setDescription]= useState()    
  const [price,setPrice]= useState()    
  const [image,setImage]= useState()  
  const [openDelete,setOpenDelete] = useState(null)
  const [openEdit,setOpenEdit] = useState(null)
  const [quantity,setQuantity] = useState(props.quantity)

  
  const navigate = useNavigate()

  useEffect(()=>{
    setQuantity(props.quantity)
  },[props.quantity])

  const handleNav = () => {
    navigate('/marketproduct',{state: {
      productId: props.productId,
      type: props.type
    }})
  }

  const handleDelete = () => {
    Axios.post('api/market/deleteproduct',{productId: props.productId})
    .then(res=>{
      if(props.setReload) props.setReload(!props.reload)
    })
  }
  
  
  const handleSave = (e) => {
    e.preventDefault()

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
    Axios.post('api/market/updateproduct',{
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
    .then(res=>{
      setOpenEdit(null)
    })
  }

  const changeQuant = (action) => {
    Axios.post('api/users/changecartquant', {userId: props.userId, productId: props.productId, action: action})
    .then(res=> {
      if(quantity != parseInt(res.data.quantity) && res.data.quantity > 0) {
        setQuantity(parseInt(res.data.quantity))
      } else if (res.data.quantity == 0) {
        props.setChange(!props.change)
      }
      props.setChange(!props.change)
    })
  }

  return (
      <ItemPanel>
        <div className='product-info'>
          <img className='product-image' src={image && editting?URL.createObjectURL(image):props.productImage} alt=''/>
          <img className='background-image' src={window.host + props.productImage} alt=''/>
          <div className='left-info'>
            <div className='info'>
              <h2 onClick={handleNav} className='name'>{name?name:props.productName}</h2>
            </div>
            <div className='info'>
              <p className='desc'>{description?description:props.productDescription}</p>
            </div>
            <div className='info'>
             <span className='price'>${price?price:props.productPrice}</span>
            </div>
            {
              props.type != 2 && 
              <div className='btns'>
              {(props.type === 3 || props.type === 4) &&
              <>
                {props.type === 3 ? <button className='quant-btn' onClick={()=>{
                    if(quantity > 0) setQuantity(quantity - 1)
                    changeQuant("dec")
                  }}>-</button> : ''}
                x{quantity}
                {props.type === 3 ? <button className='quant-btn' onClick={()=>{
                    setQuantity(quantity + 1)
                    changeQuant("inc")
                  }}>+</button> : ''}
              </>
              }
              {props.type === 1 &&
              <>
                <button className='edit-btn delete' onClick={()=>{setOpenDelete(props.productId)}}>Delete</button>
                <button className='edit-btn' onClick={()=>{setOpenEdit(props.productId)}}>Edit</button>
              </>
              }
            </div>
            }
          </div> 
        </div>
        {
          openDelete &&
          <PopUp
            close = {()=>setOpenDelete(null)}
            content = {
              <DeleteTab>
                  <p>Are you sure that you want delete?</p>
                  <button onClick={()=>{
                    handleDelete(openDelete)
                    setOpenDelete(null)
                    }}>DELETE</button>
                  <button className='stay' onClick={()=>{setOpenDelete(null)}}>CANCEL</button>
              </DeleteTab>
            }
          />
        }
        {
          openEdit &&
          <PopUp
            close = {()=>setOpenEdit(null)}
            content = {
              <EditPage  onSubmit={e=>handleSave(e)}>
                <h2>Edit product</h2>
                <div className='new-product-info'>
                  <div className='product-info'>
                    <label>Name:</label>
                    <input type='text' onChange={(e)=>{setName(e.target.value)}}/>
                  </div>
                  <div className='product-info'>
                    <label>Description:</label>
                    <textarea type='text' onChange={(e)=>{setDescription(e.target.value)}}/>
                  </div>
                  <div className='product-info'>
                    <label>Price($):</label>
                    <input type='number' onChange={(e)=>{setPrice(e.target.value)}}/>
                  </div>
                  <div className='product-info'>
                    <label>Image:</label>
                    <input type='file' onChange={(e)=>{setImage(e.target.files[0])}}/>
                  </div>
                </div>
                <div className='btn-box'>
                  <button type='submit' className='add-btn'>Edit</button>
                </div>
              </EditPage>
            }
          />
        }
      </ItemPanel>
    )
  }

  const EditPage = styled.form`
display: flex;
flex-direction: column;
h2 {
  text-align: center;
}
.new-product-info {
  display: flex;
  flex-direction: column;
  .product-info {
    display: grid;
    grid-template-columns: 120px 1fr;
    margin: 10px 0;
    textarea {
      height: 100px;
    }
    input,textarea {
      background-color: rgba(255,255,255,0.15);
      border: none;
      outline: none;
      border-radius: 5px;
      color: white;
    }
    label {
      color: white;
      font-weight: 600;
    }
  }
}
.btn-box {
  width: 100%;
  display: flex;
  justify-content: center;
  .add-btn {
    width: fit-content;
    margin: 0 auto;
    margin: 10px 0;
    padding: 5px 20px;
    font-weight: 600;
    font-size: 20px;
    color: white;
    border: none;
    border-radius: 10px;
    background-color: transparent;
    transition: 0.2s ease-in-out;
    &:hover {
      cursor: pointer;
      background-color: white; 
      color: black;
    }
  }
}
`
  
  const DeleteTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  button {
      width: 90%;
      background-color: rgba(255,0,0,0.6);
      color: rgb(230,230,230);
      padding: 8px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 2px;
      margin-bottom: 20px;
      border: none;
      box-shadow: 5px 5px 8px rgba(0,0,0,0.6);
      transition: 0.3s ease-in-out;
      &:hover {
          cursor: pointer;
          background-color: rgba(255,0,0,0.9);
      }
  }
  
  .stay {
      background-color: rgba(255,255,255,0.3);
      color: white;
      border: 1px solid rgba(255,255,255,0.6);
      &:hover {
          background-color: white;
          color: black;
      }
  }
  `
  
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
      .btns {
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
          user-select: none;
          background-color: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 3px;
          transition: 0.2s ease-in-out;
          &:hover {
            cursor: pointer;
            background-color: white;
            color: black;
          }
        }
        .edit-btn {
          margin: 0 5px;
          padding: 5px 3px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          user-select: none;
          background-color: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 8px;
          transition: 0.2s ease-in-out;
          &:hover {
            cursor: pointer;
            background-color: white;
            color: black;
          }
        }
        .delete {
          background-color: rgba(255,0,0,0.1);
          border: 1px solid rgba(255,0,0,0.5);
          color: red;
          &:hover {
            background-color: red;
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
          padding: 0;
          margin: 0;
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

  `

export default Item
