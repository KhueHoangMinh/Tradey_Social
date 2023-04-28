import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Axios from 'axios'

function Item(props) {
    return (
      <ItemPanel>
        <div className='product-info'>
          <img src={props.productImage} alt=''/>
          <div className='left-info'>
            <div className='info'>
              <label>Name:</label>
              <span className='name'>{props.productName}</span>
            </div>
            <div className='info'>
              <label>Link:</label>
              <span className='desc'>{props.productLink}</span>
            </div>
          </div>
        </div>
        <a className='edit-btn'>Edit</a>
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
      padding: 20px 0px;
      .info {
        display: grid;
        grid-template-columns: 110px 1fr;
        label {
          font-weight: 600;
        }
      }
    }
  }
  `



function Advertisement() {
  const [name, setName] = useState()
  const [image, setImage] = useState()
  const [link, setLink] = useState()
  const [advertisement,setAdvertisement] = useState([])
  const user = useSelector(state=>state.auth.user)
  const date = new Date()

  const handleAdd = (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('userId', user.user_id)
    data.append('name', name)
    data.append('image', image)
    data.append('link', link)


    Axios.post('/api/postadvertisement', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res=>{
      }
    )
  }

  useEffect(()=>{
    Axios.post('/api/getadvertisement', {userId: user.user_id})
    .then(res=> {
      setAdvertisement(res.data)
    })
  },[])
  return (
    <div>
      <AddPage>
        <h2>Add new Advertisement</h2>
        <div className='new-product-info'>
          <div className='product-info'>
            <label>Name:</label>
            <input type='text' onChange={(e)=>{setName(e.target.value)}}/>
          </div>
          <div className='product-info'>
            <label>Link:</label>
            <input type='text' onChange={(e)=>{setLink(e.target.value)}}/>
          </div>
          <div className='product-info'>
            <label>Image:</label>
            <input type='file' onChange={(e)=>{setImage(e.target.files[0])}}/>
          </div>
        </div>
        <button className='add-btn' onClick={e=>handleAdd(e)}>Add</button>
      </AddPage>
      <ProductsPage>
        <h2>Advertisements</h2>
        <div className='product-list'>
          {
            advertisement.map((product)=>(
              <Item
                productId = {product ? product.market_id:''}
                productName = {product ? product.name:''}
                productImage = {product ? product.image:''}
                productLink = {product ? product.link:''}
              />
            ))
          }
        </div>
      </ProductsPage>
    </div>
  )
}

const AddPage = styled.div`
display: flex;
flex-direction: column;
h2 {
  border-bottom: 1px solid rgba(255,255,255,0.6);
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
      border-radius: 5px;
      color: white;
    }
    label {
      color: white;
      font-weight: 600;
    }
  }
}

.add-btn {
width: fit-content;
margin: 10px auto;
padding: 5px 20px;
font-weight: 600;
font-size: 20px;
color: white;
border: none;
border-radius: 5px;
background-color: rgba(51,255,255,0.5);
transition: 0.2s ease-in-out;
&:hover {
  background-color: rgba(51,255,255,0.8); 
}
}
`

const ProductsPage = styled.div`
display: flex;
flex-direction: column;
h2 {
  border-bottom: 1px solid rgba(255,255,255,0.6);
}
`

export default Advertisement
