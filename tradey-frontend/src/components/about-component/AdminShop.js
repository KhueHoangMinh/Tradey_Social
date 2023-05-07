import React,{useEffect, useState} from 'react'
import styled from 'styled-components'
import Item from './Item'
import Axios from 'axios'
import { useSelector } from 'react-redux'

function AdminShop() {
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [price, setPrice] = useState()
    const [image, setImage] = useState()
    const [shopProducts,setShopProducts] = useState([])
    const user = useSelector(state=>state.auth.user)

    useEffect(()=>{
    },[user])

    const handleAdd = (e) => {
      e.preventDefault()

      const data = new FormData()
      data.append('userId', user.user_id)
      data.append('name', name)
      data.append('description', description)
      data.append('price', price)
      data.append('image', image)
      data.append('type', 'shop')

      Axios.post('/api/postproduct', data, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })
      .then(res=>{
        }
      )
    }

    useEffect(()=>{
      Axios.post('/api/getproductbysellerid', {userId: user.user_id})
      .then(res=> {
        setShopProducts(res.data)
      })
    },[])
    return (
      <div>
        <AddPage>
          <h2>Add new product</h2>
          <form onSubmit={e=>handleAdd(e)}>
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
                <input type='file' onChange={(e)=>{
                    // new Promise(()=>{
                    //   Resizer.imageFileResizer(e.target.files[0],300,300,'PNG',100,0,(uri)=>{setImage(uri)},'base64')
                    // })
                  setImage(e.target.files[0])
                  }}/>
              </div>
            </div>
            {image && <img src={URL.createObjectURL(image)} style={{width: '100%'}} alt=''/>}
            <button type='submit' className='add-btn'>Add</button>
          </form>
        </AddPage>
        <ProductsPage>
          <h2>Your market products</h2>
          <div className='product-list'>
          {
            shopProducts.map((product)=>(
              <Item
                type={0}
                productId = {product ? product.product_id:''}
                productName = {product ? product.product_name:''}
                productDescription = {product ? product.description:''}
                productPrice = {product ? product.price:''}
                productImage = {product ? product.image:''}
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

export default AdminShop
