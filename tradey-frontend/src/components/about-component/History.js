import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Loading from '../Loading'
import ItemPanel from './Item'

function Bill(props) {
  var total = 0

  return (
    <BillPanel>
      <GeneralDetails>
        <h1>Bill ID: {props.bill.bill_id}</h1>
        <div className='general-info'>
          <label>Date:</label>
          <span>{props.bill.time}</span>
        </div>
        <div className='general-info'>
          <label>Status:</label>
          <span>{props.bill.status}</span>
        </div>
      </GeneralDetails>
      <BillDetails>
        <ShopBill>
          <h2>Items</h2>
          <div className='item-list'>
            {
              props.bill.billItems && 
              props.bill.billItems.map((item) => (
              <>
                <p style={{display: 'none'}}>{total += item.price * item.quantity}</p>
                <ItemPanel
                  type = {4}
                  productId = {item.product_id}
                  productName = {item.product_name}
                  productImage = {item.image}
                  productDescription = {item.description}
                  productPrice = {item.price}
                  quantity = {item.quantity}
                />
              </>
            ))
            }
          </div>
        </ShopBill>
        <Total>
          <h2>Total: ${total}</h2>
        </Total>
      </BillDetails>
    </BillPanel>
  )
}

function History() {
  const [bills, setBills] = useState([])
  const user = useSelector(state=>state.auth.user)
  const [loading,setLoading] = useState(0)

  useEffect(()=>{
    Axios.post('/api/getbillsbyuser',{userId: user.user_id})
    .then(res=> {
      setBills(res.data)
      setLoading(1)
    })
  },[])

  return (
    <HistoryPanel>
      {loading === 1 ? (bills && bills.map((bill) => (
        <Bill bill={bill}/>
      ))) : <Loading></Loading>}
    </HistoryPanel>
  )
}

const HistoryPanel = styled.div`
display: flex;
flex-direction: column;
.type-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  button {
    height: 30px;
    border-radius: 5px;
    border: none;
    background-color: rgba(255,255,255,0.2);
    color: white;
    font-weight: 600;
    transition: 0.2s ease-in-out;
    &:hover {
    background-color: rgba(255,255,255,0.3);
    }
  }
  .active {
    background-color: rgba(255,255,255,0.4);
    &:hover {
    background-color: rgba(255,255,255,0.5);
    }
  }
}
`

const BillPanel = styled.div`
display: flex;
flex-direction: column;
padding-bottom: 10px;
`

const GeneralDetails = styled.div`
display: flex;
flex-direction: column;
h1 {
  margin: 10px 0;
}
.general-info {
  margin: 5px;
  display: grid;
  grid-template-columns: 70px 1fr;
  label {
    font-weight: 600;
  }
}
`

const BillDetails = styled.div`
padding: 10px 30px;
border-radius: 10px;
background-color: rgba(255,255,255,0.1);
`

const ShopBill = styled.div`
display: flex;
flex-direction: column;
h2 {
}
.item-list {
  display: flex;
  flex-direction: column;
}
`

const Total = styled.div`
margin-top: 10px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`

export default History
