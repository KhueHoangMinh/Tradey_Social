import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Item from './Item'
import Axios from 'axios'
import Loading from '../Loading'
import PopUp from '../PopUp'

function Shop() {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()
  const [image, setImage] = useState()
  const [marketProducts,setMarketProducts] = useState([])
  const [loading,setLoading] = useState(0)
  const user = useSelector(state=>state.auth.user)
  const [popUp,setPopUp] = useState(false)
  const [reload,setReload] = useState(false)
  const date = new Date()

  const handleAdd = (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('userId', user.user_id)
    data.append('name', name)
    data.append('description', description)
    data.append('price', price)
    data.append('image', image)
    data.append('type', 'market')

    Axios.post('/api/postproduct', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res=>{
      setReload(!reload)
      setPopUp(false)
    })
  }


  useEffect(()=>{
    Axios.post('/api/getproductbysellerid', {userId: user.user_id})
    .then(res=> {
      setMarketProducts(res.data)
      setLoading(1)
    })
  },[reload])

  return (
    <div>
      <ProductsPage>
        <div className='header'>
          <h2>Your shop</h2>
          <button className='add-btn' onClick={()=>setPopUp(true)}>Add</button>
        </div>
        <div className='product-list'>
          {
            loading === 1 ? (marketProducts.map((product)=>(
              <Item
                type={1}
                productId = {product ? product.product_id:''}
                productName = {product ? product.product_name:''}
                productDescription = {product ? product.description:''}
                productPrice = {product ? product.price:''}
                productImage = {product ? product.image:''}
                reload = {reload}
                setReload = {setReload}
              />
            ))) : <Loading></Loading>
          }
        </div>
      </ProductsPage>
      {
        popUp &&
        <PopUp
          close = {()=>setPopUp(false)}
          content = 
              {<AddPage  onSubmit={e=>handleAdd(e)}>
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
                <div className='btn-box'>
                  <button type='submit' className='add-btn'>Add</button>
                </div>
              </AddPage>}
          
        />
      }
    </div>
  )
}

const AddPage = styled.form`
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

const ProductsPage = styled.div`
display: flex;
flex-direction: column;
position: relative;
.header {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: rgb(10,10,10);
  .add-btn {
    width: fit-content;
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
.product-list {
  margin-top: 80px;
}
`

export default Shop
