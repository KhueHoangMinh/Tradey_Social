import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Item from './Item'
import Axios from 'axios'
import Loading from '../Loading'

function Shop() {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()
  const [image, setImage] = useState()
  const [marketProducts,setMarketProducts] = useState([])
  const [loading,setLoading] = useState(0)
  const user = useSelector(state=>state.auth.user)
  const date = new Date()

  const handleAdd = (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('userId', user.user_id)
    data.append('name', name)
    data.append('description', description)
    data.append('time', date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+date.getDate().toString()+' '+date.getHours().toString()+'-'+date.getMinutes().toString()+'-'+date.getSeconds().toString())
    data.append('price', price)
    data.append('image', image)

    Axios.post('/api/postmarketproduct', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res=>{
      }
    )
  }

  useEffect(()=>{
    Axios.post('/api/getusermarket', {userId: user.user_id})
    .then(res=> {
      setMarketProducts(res.data)
      setLoading(1)
    })
  },[])
  return (
    <div>
      <AddPage>
        <h2>Add new product</h2>
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
        <button className='add-btn' onClick={e=>handleAdd(e)}>Add</button>
      </AddPage>
      <ProductsPage>
        <h2>Your market products</h2>
        <div className='product-list'>
          {
            loading == 1 ? (marketProducts.map((product)=>(
              <Item
                type={1}
                productId = {product ? product.market_id:''}
                productName = {product ? product.product_name:''}
                productDescription = {product ? product.description:''}
                productPrice = {product ? product.price:''}
                productImage = {product ? product.image:''}
              />
            ))) : <Loading></Loading>
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

export default Shop
