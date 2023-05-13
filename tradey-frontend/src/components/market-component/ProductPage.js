import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from '../Loading'
import Item from './Item'
import Button from '../Button.js'

function ProductPage(props) {
  const {state} = useLocation()
  const user = useSelector(state => state.auth.user)
  const [product,setProduct] = useState()
  const [productsFromShop, setProductsfromShop] = useState([])
  const [loading,setLoading] = useState(0)
  const [loading1,setLoading1] = useState(0)
  const [seller, setSeller] = useState()
  const [quantity,setQuantity] = useState(1)

  useEffect(()=>{
    Axios.post('/api/getproductbyid', {productId: state.productId})
    .then(res=>{
      setProduct(res.data[0])
      setLoading(1)
      Axios.post('/api/getuserbyid', {userId: res.data[0].seller_id})
      .then(res1 => {
        Axios.post('/api/getproductbysellerid', {userId: res.data[0].seller_id})
        .then(res2=> {
          setSeller(res1.data[0])
          setProductsfromShop(res2.data.slice(0,10))
          setLoading1(1)
        })
      })
    })
  },[state])

  const handleAdd = () => {
    if(quantity > 0) {
      Axios.post('/api/addtocart', {userId: user.user_id, productId: product.product_id, quantity: quantity, action: 'add'})
      .then(res => {
      })
    }
  }
  return (
    <div>
          <Container>
          {
            loading === 1 ? (
            <div className='content'>
              <img className='background-image' src={product ? window.host + product.image:''} alt=''/>
              <div className='image-container'>
                <img className='product-image' src={product ? window.host + product.image:''} alt=''/>
              </div>
              <LeftColumn>
                <div className='user-detail'>
                  <img src={seller ? (seller.photourl ? window.host + seller.photourl:'/images/user.png'):'/images/user.png'} alt=''/>
                    <div>
                      <h3><a href='https://youtube.com'>{seller ? seller.name:''}</a></h3>
                      <span>{seller ? seller.email:''}</span>
                      <span>{product ? product.time:''}</span>
                    </div>
                </div>
                <div className='info'>
                    <h1>{product ? product.product_name:''}</h1>
                    <p>{product ? product.description:''}</p>
                    <span className='price'>$ {product ? product.price:''}</span>
                </div>
                <div className='add-btn' >
                  <div className='quantity-input'>
                    x
                    <input type='text' value={quantity} onChange={(e)=>{
                      if(!isNaN(parseInt(e.target.value)) || e.target.value == "") setQuantity(e.target.value)
                    }}/>
                  </div>
                  <Button 
                    text='Add to Cart'
                    function={handleAdd}
                  />
                </div>
              </LeftColumn>
            </div>) : <Loading></Loading>
          }
          <More>
            <h2>More products from this shop</h2>
            {
            loading1 === 1 ? (
              <div className='item-list'>
                {productsFromShop && productsFromShop.map((item)=>(
                  <Item 
                    userId = {user ? user.user_id:''}
                    sellerId = {seller ? seller.user_id:''}
                    userPhotoURL = {seller ? seller.photourl:''}
                    userDisplayName = {seller ? seller.name:''}
                    userEmail = {seller ? seller.email:''}
                    productTime = {item ? item.time:''}
                    productId={item ? item.product_id:''}
                    name={item ? item.product_name:''}
                    description={item ? item.description:''}
                    image={item ? item.image:''}
                    price={item ? item.price:''}
                    type={item ? item.type:''}
                  />
                ))}
              </div>
              ) : <Loading></Loading>
            }
          </More>
          </Container>
    </div>
  )
}


const Container = styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: black;
height: fit-content;
.content {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 70%;
  overflow: hidden;
  padding: 30px 15%;
  gap: 20px;
  margin-top: 80px;
  background-color: transparent;
  /* min-height: calc(100vh - 140px); */
  height: fit-content;
  color: rgb(230,230,230);
  z-index: 1;
  .image-container {
    box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
    width: 100%;
    height: fit-content;
    overflow: hidden;
    position: relative;
    border-radius: 20px;

    &::after {
      padding-top: 60%;
      content: "";
      display: block;
    }
    .product-image {
        height: 100%;
        width: 100%;
        object-fit: cover;
        position: absolute;
    }
  }
  @media (max-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
  .background-image {
    position: absolute;
    height: 250vh;
    width: 250vw;
    top: -70%;
    left: -50%;
    object-fit: contain;
    z-index: -1;
    filter: blur(15px) brightness(0.3);
  }
}
`

const LeftColumn = styled.div`
display: flex;
flex-direction: column;
.user-detail {
  position: relative;
  display: flex;
  flex-direction: row;
  z-index: 2;
  width: fit-content;
  padding: 10px 15px;
  transition: 0.2s ease-in-out;
  margin-bottom: 20px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 5px 5px 20px rgba(0,0,0,0.6);

  div{
    display: flex;
    flex-direction: column;
    h3 {
      padding: 0;
      margin: 0;
      margin-bottom: 1px;
      a {
        text-decoration: none;
        color: rgba(255,255,255,0.9);
        transition: 0.2s ease-in-out;
        &:hover {
          color: rgba(255,255,255,1);
        }
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
h1 {
  padding: 0;
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
}
.info {
    margin-bottom: 20px;
    p {
        height: fit-content;
        text-align: justify;
        max-height: 500px;
        font-size: 18px;
    }
    .price {
      font-weight: 600;
      color: lightgreen;
    }
}
.add-btn {
  margin: 0 auto;
  display: flex;
  .quantity-input {
    color: black;
    padding: 12px;
    background-color: white;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.6);
    border-radius: 25px;
    font-size: 20px;
    font-weight: 700;
    margin-right: 15px;
    input {
      border: none;
      outline: none;
      background-color: transparent;
      width: 20px;
      font-size: 20px;
      font-weight: 700;
      padding: 0;
      margin: 0;
    }
  }
}
`

const More = styled.div`
width: calc(100% - 60px);
height: fit-content;
padding: 30px;
background-color: rgb(10,10,10);
position: relative;
display: block;
h2 {
  padding: 0;
  margin: 0;
  margin-bottom: 30px;
  color: white;
}
.item-list {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 20px;
}
`

export default ProductPage
