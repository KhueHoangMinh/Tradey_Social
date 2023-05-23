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
  
  const navigate = useNavigate()

  const handleNav = () => {
    navigate('/checkout')
  }

  useEffect(()=>{
    Axios.post('api/users/getcart',{userId: user.user_id})
    .then(res=>{
      setMarketCart(res.data)
      setLoading(1)
    })
  },[change])

  useEffect(()=> {
    var sum = 0
    for(var i = 0; i < marketCart.length; i++) {
      sum += marketCart[i].price * marketCart[i].quantity 
    }
    setTotal(sum)
  },[marketCart,change])

  return (
    <div>
      <CartPanel>
        {
          loading === 1 ? (<>
          <MarketCart>
            <h2>Shopping Cart</h2>
            <div className='item-list'>
              {
                  marketCart.map((item)=>(
                    <>
                      <Item 
                        type = {3}
                        userId = {user.user_id}
                        productId={item ? item.product_id:''}
                        productName={item ? item.product_name:''}
                        productDescription={item ? item.description:''}
                        productPrice={item ? item.price:''}
                        productImage={item ? item.image:''}
                        quantity={item ? item.quantity:''}
                        change = {change}
                        setChange = {setChange}
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
            <h2>Total: <span className='price'>$ {total}</span></h2>
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
