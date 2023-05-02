import React,{ useState,useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from 'axios'
import Loading from "./Loading";
import styled from "styled-components";
import Item from "./about-component/Item";
import Button from "./Button";
import {Input, Checkbox, Radio} from './Input.js'

function Checkout() {
    const user = useSelector(state => state.auth.user)
    const [loading,setLoading] = useState(0)
    const navigate = useNavigate()
    const [cart,setCart] = useState([])
    const [phone,setPhone] = useState()
    const [address,setAddress] = useState()
    const [note,setNote] = useState()
    const [voucher,setVoucher] = useState([])
    const [paymentMethod,setPaymentMethod] = useState('cash')
    const [total,setTotal] = useState(0)


    useEffect(()=>{
        Axios.post('/api/getcart',{userId: user.user_id})
        .then(res=>{
            if(res.data.length > 0) {
                setCart(res.data)
                setLoading(1)
            } else {
                navigate('/about')
            }
        })
      },[])

      function calculateTotal(cart,vouchers) {
        var calTotal = 0
        for(var i = 0; i < cart.length; i++) {
            calTotal += cart[i].price * cart[i].quantity
        }

        for(var i = 0; i < vouchers.length; i++) {
            calTotal = calTotal * vouchers[i].discount/100
        }
        
        if(calTotal != total) {
            setTotal(calTotal)
        }
      }

      function cartItems(cart) {
        var items = []
        var calTotal = 0
        for(var i = 0; i < cart.length; i++) {
            items.push(
                <Item 
                type = {4}
                productId={cart[i].product_id}
                productName={cart[i].product_name}
                productDescription={cart[i].description}
                productPrice={cart[i].price}
                productImage={cart[i].image}
                quantity={cart[i].quantity}
              />
            )
        }

        calculateTotal(cart,voucher)

        return items
      }

      const handleCheckout = async  (e) => {
        e.preventDefault()

        Axios.post('/api/checkout', {
          userId: user.user_id,
          phone: phone,
          address: address,
          note: note,
          voucher: voucher,
          paymentMethod: paymentMethod
        }).then(res=>{
            if(res.data[0] == 'bill_created') {
                navigate('/receipt',{state: {
                    billId: res.data[1]
                }})
            } else {
                alert('sth wrong')
            }
        })
      }

    return (
        <div>
            <CheckoutPage>
                <LeftSide>
                    <h2>Your cart</h2>
                    <div className="item-list">
                    {
                    cartItems(cart)
                    }
                    </div>
                    <div className="voucher">
                        <h2>Voucher</h2>
                        <select name="voucher" id="voucher" onChange={e=>setVoucher(e.target.value)}>
                            <option value="">Select voucher</option>
                        </select>
                    </div>
                    <h2>Total: <span className="price">$ {total}</span></h2>
                    <div className="">

                    </div>
                </LeftSide>
                <RightSide>
                    <h1>Delivery Information</h1>
                    <form onSubmit={e=>handleCheckout(e)}>
                        <Input
                            type={'text'}
                            name={'phone'}
                            value={phone}
                            setValue={setPhone}
                            id={'phone'}
                            label={'Phone'}
                        />
                        <Input
                            type={'text'}
                            name={'address'}
                            value={address}
                            setValue={setAddress}
                            id={'address'}
                            label={'Address'}
                        />
                        <div className="method">
                            <label className="method-label" htmlFor="method"><strong>Payment method</strong></label>
                            <Radio
                                name='method'
                                id='cash'
                                label='Cash'
                                value='cash'
                                setValue={setPaymentMethod}
                                checked={true}
                            />
                            <Radio
                                name='method'
                                id='card'
                                label='Card'
                                value='card'
                                setValue={setPaymentMethod}
                                checked={false}
                            />
                        </div>
                        <textarea className="note" value={note} onChange={e=>setNote(e.target.value)} placeholder="Note for the sellers..." rows={5}></textarea>
                        <div className="order-btn">
                            <Button 
                                type='submit'
                                text='Place Order'
                            />
                        </div>
                    </form>
                </RightSide>
            </CheckoutPage>
        </div>
    )
}

const CheckoutPage = styled.div`
margin-top: 80px;
display: grid;
grid-template-columns: 2fr 1fr;
height: calc(100vh - 80px);
overflow: hidden;
background-color: rgb(10,10,10);
color: white;
.price {
    color: lightgreen;
}
`

const LeftSide = styled.div`
padding: 30px;
overflow-y: scroll;
overflow-x: hidden;
.voucher {
    display: flex;
    h2 {
        padding: 0;
        margin: 0;
    }
}
`

const RightSide = styled.div`
padding: 30px;
display: flex;
flex-direction: column;
align-items: center;
h1 {
    text-align: center;
}
.order-btn {
    margin: 0 auto;
    width: fit-content;
}
.method {
    .method-label {
        color:white;
        font-size:18px;
        font-weight:normal;
        margin-left: 5px;
        transition:0.2s ease all; 
    }
}
.note {
    width: 100%;
    outline: none;
    background-color: black;
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 5px;
    resize: none;
    margin:20px 0;
}
`

export default Checkout