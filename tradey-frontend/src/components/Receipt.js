import Axios from 'axios'
import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Item from './about-component/Item'
import styled from 'styled-components'
import Loading from './Loading.js'
import Button from './Button.js'

function Receipt(props) {
    const [bill,setBill] = useState([])
    const [loading,setLoading] = useState(0)
    const {state} = useLocation()
    const [total,setTotal] = useState(0)
    const navigate = useNavigate()

    useEffect(()=>{
        Axios.post('/api/users/getbillbybillid',{billId: state.billId})
        .then(res=>{
            setBill(res.data[0])
            setLoading(1)
        })
    },[state])

    const handleNavigate = () => {
        navigate('/about')
    }

    
    function calculateTotal(cart,vouchers) {
        var calTotal = 0
        for(var i = 0; i < cart.length; i++) {
            calTotal += cart[i].price * cart[i].quantity
        }

        for(var i = 0; i < vouchers.length; i++) {
            calTotal = calTotal * vouchers[i].discount/100
        }
        
        if(calTotal !== total) {
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

        calculateTotal(cart,[])

        return items
      }

    return(
        <ReceiptStyle>
            {
                loading === 1 ? (
                    <>
                        <h1>Receipt</h1>
                        <div className='delivery-info'>
                            <h2>Order information</h2>
                            <div className='order-info'>
                                <strong>Phone: </strong>
                                <span>{bill.phone}</span>
                            </div>
                            <div className='order-info'>
                                <strong>Address: </strong>
                                <span>{bill.address}</span>
                            </div>
                            <div className='order-info'>
                                <strong>Note: </strong>
                                <span>{bill.note}</span>
                            </div>
                        </div>
                        <div className='item-list'>
                            <h2>Items</h2>
                            {
                                cartItems(bill.billItems)
                            }
                        </div>
                        <h2>Total: <span className='price'>$ {total}</span></h2>
                        <div className='complete-btn'>
                            <Button
                                text='Complete'
                                function={handleNavigate}
                            />
                        </div>
                    </>
                ) : <Loading></Loading>
            }
        </ReceiptStyle>
    )
}

const ReceiptStyle = styled.div`
min-height: calc(100vh - 80px);
margin-top: 80px;
background-color: rgb(10,10,10);
padding: 30px 30%;
color: white;
h1 {
    text-align: center;
}
.price {
    color: lightgreen;
}
.delivery-info {
    margin: 10px 0;
    .order-info {
        margin: 10px 0;
        display: grid;
        grid-template-columns: 80px 1fr;
    }
}
.complete-btn {
    margin: 0 auto;
    width: fit-content;
}
`

export default Receipt