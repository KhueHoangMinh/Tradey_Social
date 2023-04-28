import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Item from './Item'
import Loading from '../Loading'

function Cart() {
  const user = useSelector(state=>state.auth.user)
  const [shopCart, setShopCart] = useState([])
  const [marketCart, setMarketCart] = useState([])
  const [total, setTotal] = useState(0)
  const date = new Date()
  const [change,setChange] = useState(true)
  const [loading,setLoading] = useState(0)
  var calTotal = 0

  useEffect(()=>{
    Axios.post('/api/getcart',{userId: user.user_id})
    .then(res=>{
      setShopCart(res.data.shopCart)
      setMarketCart(res.data.marketCart)
      setLoading(1)
    })
  },[change])

  useEffect(()=>{
    console.log(shopCart)
  },[shopCart.length])

  const handleCheckout = async  () => {
    await Axios.post('/api/checkout', {
      userId: user.user_id
    })
  }
  return (
    <div>
      <CartPanel>
        {
          loading == 1 ? (<><ShopCart>
            <h2>Items from Shop</h2>
            <div className='item-list'>
              {
                shopCart.map((item)=>(
                  <>
                    <a style={{display: 'none'}}>{calTotal += item.price* item.quantity}</a>
                    <Item 
                      type = {3}
                      productId={item ? item.product_id:''}
                      productName={item ? item.product_name:''}
                      productDescription={item ? item.description:''}
                      productPrice={item ? item.price:''}
                      productImage={item ? item.image:''}
                      quantity={item ? item.quantity:''}
                    />
                  </>
                ))
              }
            </div>
          </ShopCart>
          <MarketCart>
            <h2>Items from Market</h2>
            <div className='item-list'>
              {
                  marketCart.map((item)=>(
                    <>
                      <a style={{display: 'none'}}>{calTotal += item.price* item.quantity}</a>
                      <Item 
                        type = {3}
                        productId={item ? item.product_id:''}
                        productName={item ? item.product_name:''}
                        productDescription={item ? item.description:''}
                        productPrice={item ? item.price:''}
                        productImage={item ? item.image:''}
                        quantity={item ? item.quantity:''}
                      />
                    </>
                  ))
                }
            </div>
          </MarketCart></>) : <Loading></Loading>
        }
        
        <Checkout>
          <h2>Total: ${calTotal}</h2>
          <button onClick={handleCheckout} 
          // disabled={shopCart.length > 0 || marketCart.length > 0 ? 'false':'true'}
          >Checkout</button>
        </Checkout>
      </CartPanel>
    </div>
  )
}

const CartPanel = styled.div`
display: flex;
flex-direction: column;
`

const ShopCart = styled.div`
display: flex;
flex-direction: column;
h2 {
  border-bottom: 1px solid rgba(255,255,255,0.5);
}
.item-list {
  display: flex;
  flex-direction: column;
}
`

const MarketCart = styled.div`
display: flex;
flex-direction: column;
h2 {
  border-bottom: 1px solid rgba(255,255,255,0.5);
}
.item-list {
  display: flex;
  flex-direction: column;
}
`

const Checkout = styled.div`
border-top: 1px solid rgba(255,255,255,0.5);
margin-top: 10px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
button {
padding: 5px 20px;
color: white;
font-weight: 600;
font-size: 20px;
border-radius: 5px;
background-color: rgba(51,255,255,0.5);
transition: 0.2s ease-in-out;
&:hover {
  background-color: rgba(51,255,255,0.9);
}
}
`


export default Cart
