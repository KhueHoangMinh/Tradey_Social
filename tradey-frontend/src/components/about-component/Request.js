import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import Loading from '../Loading'

function Item(props) {
  const [product,setProduct] = useState()

  useEffect(()=>{
    Axios.post('/api/getproductbyid', {type: 'market',productId: props.productId})
    .then(res => {
      setProduct(res.data[0])
    })
  },[])

  return (
    <ItemPanel>
      <div className='product-info'>
        <img src={product ? product.image:''} alt=''/>
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
  useEffect(()=>{
      Axios.post('/api/getuserbyid',{userId: props.order.user_id})
      .then(res=>{
          setUser(res.data[0])
      })
  },[])
    return (
        <div>
            <RequestPanel>
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
                            <Item
                                productId = {item.product_id}
                            />
                        ))
                    }
                </div>
                <button className='done-btn'>Done</button>
            </RequestPanel>
        </div>
    )
}

function Request(props) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(0)
  useEffect(()=>{
      Axios.post('/api/getmarketbills',{userId: props.user.user_id})
      .then(res=>{
          setOrders(res.data)
          setLoading(1)
      })
  },[])
  return (
    <div>
      {
      loading == 1? (orders.map((order)=>(
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

export default Request
