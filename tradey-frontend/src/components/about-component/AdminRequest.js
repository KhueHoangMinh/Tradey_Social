import React, {useEffect, useState} from 'react'
import {  useSelector } from 'react-redux'
import styled from 'styled-components'
import Axios from 'axios'
import Loading from '../Loading.js'
import ItemPanel from './Item'

function SingleAdminRequest(props) {
    const [user,setUser] = useState()
    useEffect(()=>{
        Axios.post('/api/getuserbyid',{userId: props.order.user_id})
        .then(res=>{
            setUser(res.data[0])
        })
    },[])
    return (
        <div>
            <AdminRequestPanel>
                <div className='userinfo'>
                    <img src={user? user.photourl: ''} alt=''/>
                    <div>
                        <h3>{user? user.name: ''}</h3>
                        <span>{user? user.email: ''}</span>
                        <span>{props.order.time}</span>
                    </div>
                </div>
                <div className='item-list'>
                    {
                        props.order.billItems.map((item)=>(
                          <ItemPanel
                            type = {4}
                            productId = {item.product_id}
                            productName = {item.product_name}
                            productImage = {item.image}
                            productDescription = {item.description}
                            productPrice = {item.price}
                            quantity = {item.quantity}
                          />
                        ))
                    }
                </div>
                <button className='done-btn'>Done</button>
            </AdminRequestPanel>
        </div>
    )
}

function AdminRequest(props) {
    const [orders, setOrders] = useState([])
    const [loading,setLoading] = useState(0)
    const user = useSelector(state=>state.auth.user)
    useEffect(()=>{
        Axios.post('/api/getrequests', {userId: user.user_id})
        .then(res=>{
          setOrders(res.data)
          setLoading(1)
        })
    },[])

    useEffect(()=>{
    },[orders])

  return (
    <div>
        {
           loading == 1 ? (orders && orders.map((order)=>(
                <SingleAdminRequest
                    order = {order}
                />
            ))) : <Loading></Loading>
        }
    </div>
  )
}

const AdminRequestPanel = styled.div`
background-color: rgba(255,255,255,0.1);
padding: 10px;
border-radius: 10px;
margin-bottom: 20px;
.userinfo {
  display: flex;
  flex-direction: row;
  margin: 20px 0;

  div{
    display: flex;
    flex-direction: column;
    h3 {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
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
  }
}
.item-list {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}
.done-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 60px;
    margin: 0 auto;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    border: none;
    background-color: rgba(51,255,255,0.3);
    transition: 0.2s ease-in-out;
    &:hover {
        background-color: rgba(51,255,255,0.6);
    }
}
`

export default AdminRequest
