import React from 'react'
import styled from 'styled-components'
import Item from './Item'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import Loading from '../Loading'

function Main() {
  const user = useSelector(state=>state.auth.user)
  const [shopPage,setShopPage] = useState(1)
  const [displayShop,setDisplayShop] = useState([])
  const [shopItemList, setShopItemList] = useState([])
  const [shopPages, setShopPages] = useState([])
  const [shopPageTotal, setShopPageTotal] = useState(0)
  const [loading,setLoading] = useState(0)
  
  var Pages = []
  var shopItems = []

  useEffect(()=>{
    Axios.get('/api/getshop')
    .then(res=>{
      setShopItemList(res.data)
      setLoading(1)
    })
  },[])
  useEffect(()=>{
    if(shopItemList.length > 0 ) {
      setShopPageTotal(Math.ceil(shopItemList.length/20.0))
    }
    // console.log(shopItemList)
  },[shopItemList])

  useEffect(()=>{
    Pages = []
    for(var i=0;i<shopPageTotal;i++) {
      Pages.push(i+1)
    }
    setShopPages(Pages)

    shopItems = []
    if(shopItemList.length > 20) {
      for(var i=0;i<20;i++) {
        shopItems.push(shopItemList[i])
      }
    } else {
      for(var i=0;i<shopItemList.length;i++) {
        shopItems.push(shopItemList[i])
      }
    }
    console.log(shopItems)
    setDisplayShop(shopItems)
  },[shopPageTotal])


  const handleShopPage = (i) =>{
    shopItems = []
    if(shopPage == shopPageTotal) {
      for(var i=(shopPage-1)*20;i<shopItemList.length;i++) {
        shopItems.push(shopItemList[i])
      }
      setDisplayShop(shopItems)
      return
    } else if(shopPageTotal > 0) {
      for(var i=(shopPage-1)*20;i<(shopPage-1)*20+20;i++) {
        shopItems.push(shopItemList[i])
      }
      setDisplayShop(shopItems)
    }
  }

  useEffect(()=> {
    handleShopPage(shopPage)
  },[shopPage])
  return (
    <div>
      <Panel>
        <h2>SHOP</h2>
        <div className='page-btn'>
            {
              shopPages.map((i)=>(
                <a className={shopPage == i?'active':'inactive'} onClick={()=>{
                  setShopPage(i)
                }}>{i}</a>
              ))
            }
          </div>
          {
          loading == 1 ?(<div className='item-list'>
            {
               displayShop.map((item)=>(
                <Item 
                  userId = {user ? user.user_id:''}
                  productId={item ? item.product_id:''}
                  name={item ? item.product_name:''}
                  description={item ? item.description:''}
                  image={item ? item.image:''}
                  price={item ? item.price:''}
                  brand={item ? item.brand:''}
                  engine={item ? item.engine:''}
                  carType={item ? item.carType:''}
                />
              ))
            }
          </div>) : <Loading></Loading>

          }
          <div className='page-btn'>
            {
              shopPages.map((i)=>(
                <a className={shopPage == i?'active':'inactive'} onClick={()=>{
                  setShopPage(i)
                }}>{i}</a>
              ))
            }
          </div>
      </Panel>
    </div>
  )
}

const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
padding: 30px;
display: flex;
flex-direction: column;
justify-content: center;
h2 {
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
  padding-bottom: 5px;
  color: rgb(51,255,255);
  letter-spacing: 3px;
}
.item-list {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
}
.page-btn {
    margin: 5px auto;
    a {
      margin: 0 5px;
      color: rgba(255,255,255,0.5);
      cursor: default;
      transition: 0.2s ease-in-out;
    }
    .inactive {
      &:hover {
        color: rgba(255,255,255,0.8);
      }
    }
    .active {
      color: rgba(255,255,255,0.9);
    }
  }
@media (max-width: 1200px) {
  .item-list {
    grid-template-columns: repeat(3,1fr);
  }
}
`

export default Main
