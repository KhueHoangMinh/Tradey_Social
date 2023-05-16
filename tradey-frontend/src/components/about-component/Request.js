import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import Loading from '../Loading'
import Item from './Item'
import Button from '../Button'
import PopUp from '../PopUp'

function Itemmmm(props) {
  const [product,setProduct] = useState()

  useEffect(()=>{
    Axios.post('/api/market/getproductbyid', {type: 'market',productId: props.productId})
    .then(res => {
      setProduct(res.data[0])
    })
  },[])

  return (
    <ItemPanel>
      <div className='product-info'>
        <img src={product ? window.host + product.image:''} alt=''/>
        <div className='left-info'>
          <div className='info'>
            <label>Name:</label>
            <span className='name'>{product ? product.product_name:''}</span>
          </div>
          <div className='info'>
            <label>Description:</label>
            <span className='desc'>{product ? product.description:''}</span>
          </div>
          <div className='info'>
            <label>Price:</label>
            <span className='price'>{product ? product.price:''}</span>
          </div>
        </div>
      </div>
    </ItemPanel>
  )
  }
  
  const ItemPanel = styled.div`
  display: flex;
  flex-direction: row;
  height: 120px;
  width: calc(100% - 20px);
  justify-content: space-between;
  background-color: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  .product-info {
    display: flex;
    flex-direction: row;
    img {
      height: 100%;
      width: 120px;
      object-fit: cover;
    }
    .left-info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 0px;
      .info {
        display: grid;
        grid-template-columns: 110px 1fr;
        label {
          font-weight: 600;
        }
      }
    }
  }
  `

function SingleRequest(props) {
  const [user,setUser] = useState()
  const [total,setTotal] = useState(0)
  const [status,setStatus] = useState(props.order.status)
  const [popUp,setPopUp] = useState(false)
  
  const calTotal = () => {
    var sum = 0
    for(var i = 0; i < props.order.billItems.length; i++) {
      sum += props.order.billItems[i].price * props.order.billItems[i].quantity
    }
    setTotal(sum)
  }

  useEffect(()=>{
      Axios.post('/api/users/getuserbyid',{userId: props.order.user_id})
      .then(res=>{
          setUser(res.data[0])
      })
      
  calTotal()
  },[])

  const changeStatus = (status) => {
    Axios.post("/api/users/changeorderstatus", {orderId: props.order.bill_id, userId: props.order.user_id, status: status})
    .then(res=>{
      if(res.data === "updated") setStatus(status)
      setPopUp(false)
    })
  }

    return (
        <div>
            <RequestPanel>
                <div className='userinfo'>
                    <img src={user? (user .photourl ? window.host + user.photourl: '/images/user.png') : '/images/user.png'} alt=''/>
                    <div>
                        <h3>{user? user.name: ''}</h3>
                        <span>{user? user.email: ''}</span>
                        <span>{props.order.time}</span>
                    </div>
                </div>
                <div className='order-info'>
                  
                  <div className='indiv-order-info'>
                      <h3>Bill ID: </h3>
                      <h3>{props.order.bill_id}</h3>
                  </div>
                  <div className='indiv-order-info'>
                    <strong>Phone: </strong>
                    <span>{props.order.phone}</span>
                  </div>
                  <div className='indiv-order-info'>
                    <strong>Address: </strong>
                    <span>{props.order.address}</span>
                  </div>
                  <div className='indiv-order-info'>
                    <strong>Note: </strong>
                    <span>{props.order.note}</span>
                  </div>
                  <div className='indiv-order-info'>
                    <strong>Status: </strong>
                    <span className={`status ${status.toLowerCase()}`}>{status}</span>
                  </div>
                </div>
                <div className='item-list'>
                    {
                        props.order.billItems.map((item)=>(
                            <Item
                              type = {4}
                              userId = {user && user.user_id}
                              productId={item ? item.product_id:''}
                              productName={item ? item.product_name:''}
                              productDescription={item ? item.description:''}
                              productPrice={item ? item.price:''}
                              productImage={item ? item.image:''}
                              quantity={item ? item.quantity:''}
                            />
                        ))
                    }
                </div>
                <h2>Total: <span className='price'>${total}</span></h2>
                <div className='btn-box'>
                  <Button
                    text = "Change status"
                    function = {()=>{
                      setPopUp(true)
                    }}
                  />
                </div>
                {
                  popUp &&
                  <PopUp
                    close = {()=>{setPopUp(false)}}
                    content = {
                      <>
                      <h2>Change Order Status</h2>
                      <StatusButtons>
                        <Button
                          text = "PENDING"
                          function = {()=>{
                            changeStatus("PENDING")
                          }}
                        />
                        <Button
                          text = "PROCESSING"
                          function = {()=>{
                            changeStatus("PROCESSING")
                          }}
                        />
                        <Button
                          text = "DELIVERING"
                          function = {()=>{
                            changeStatus("DELIVERING")
                          }}
                        />
                        <Button
                          text = "DELIVERED"
                          function = {()=>{
                            changeStatus("DELIVERED")
                          }}
                        />
                      </StatusButtons>
                      </>
                    }
                  />
                }
            </RequestPanel>
        </div>
    )
}


const StatusButtons = styled.div`
display: flex;
flex-wrap: wrap;
button {
  margin: 10px 10px;
}
`

function Request(props) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(0)
  useEffect(()=>{
      Axios.post('/api/users/getrequests',{userId: props.user.user_id})
      .then(res=>{
          setOrders(res.data)
          setLoading(1)
      })
  },[])
  return (
    <div>
      {
      loading === 1? (orders.map((order)=>(
          <SingleRequest
              order = {order}
          />
      ))): <Loading></Loading>
  }
    </div>
  )
}

const RequestPanel = styled.div`
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
.order-info {
  margin-bottom: 20px;
  .indiv-order-info {
    display: grid;
    grid-template-columns: 80px 1fr;
    .status {
      font-weight: 600;
    }
    .status.pending {
      color: red;
    }
    .status.processing {
      color: orange;
    }
    .status.delivering {
      color: yellow;
    }
    .status.delivered {
      color: green;
    }
  }
}
.item-list {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}
.btn-box {
  width: fit-content;
  margin: 0 auto;
}
.price {
  color: lightgreen;
}
`

export default Request
