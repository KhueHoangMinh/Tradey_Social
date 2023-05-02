import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Item from './Item'
import Loading from '../Loading.js'
import Button from '../Button.js'

function Cart() {
  const user = useSelector(state=>state.auth.user)
  const [marketCart, setMarketCart] = useState([])
  const [total, setTotal] = useState(0)
  const [change,setChange] = useState(true)
  const [loading,setLoading] = useState(0)
  var calTotal = 0
  
  const navigate = useNavigate()

  const handleNav = () => {
    navigate('/checkout')
  }

  useEffect(()=>{
    Axios.post('/api/getcart',{userId: user.user_id})
    .then(res=>{
      setMarketCart(res.data)
      setLoading(1)
    })
  },[change])

  return (
    <div>
      <CartPanel>
        {
          loading == 1 ? (<>
          <MarketCart>
            <h2>Shopping Cart</h2>
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
        {
          marketCart.length > 0 ? (
          <Checkout>
            <h2>Total: <span className='price'>$ {calTotal}</span></h2>
            <Button 
              text='Check out'
              function={handleNav}
            />
          </Checkout>
          ) : (
            <h3>No item</h3>
          )
        }
      </CartPanel>
    </div>
  )
}

const CartPanel = styled.div`
display: flex;
flex-direction: column;
`

const MarketCart = styled.div`
display: flex;
flex-direction: column;
.item-list {
  display: flex;
  flex-direction: column;
}
`

const Checkout = styled.div`
margin-top: 10px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
.price {
  color: lightgreen;
}
`


export default Cart
