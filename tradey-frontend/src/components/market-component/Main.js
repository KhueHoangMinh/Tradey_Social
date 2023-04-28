import React from 'react'
import styled from 'styled-components'
import Item from './Item'
import { useEffect } from 'react'
import { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import Loading from '../Loading'

function Main(props) {
  const user = useSelector(state=>state.auth.user)
  const [marketPage,setMarketPage] = useState(1)
  const [displayMarket,setDisplayMarket] = useState([])
  const [marketItemList, setMarketItemList] = useState([])
  const [marketPages, setMarketPages] = useState([])
  const [marketPageTotal, setMarketPageTotal] = useState(0)
  const [loading,setLoading] = useState(0)
  
  var Pages = []
  var marketItems = []

  useEffect(()=>{
    Axios.get('/api/getmarket')
    .then(res=>{
      setMarketItemList(res.data)
      setLoading(1)
    })
  },[])
  useEffect(()=>{
    if(marketItemList.length > 0 ) {
      setMarketPageTotal(Math.ceil(marketItemList.length/18.0))
    }
    // console.log(shopItemList)
  },[marketItemList])

  useEffect(()=>{
    Pages = []
    for(var i=0;i<marketPageTotal;i++) {
      Pages.push(i+1)
    }
    setMarketPages(Pages)

    marketItems = []
    if(marketItemList.length > 20) {
      for(var i=0;i<20;i++) {
        marketItems.push(marketItemList[i])
      }
    } else {
      for(var i=0;i<marketItemList.length;i++) {
        marketItems.push(marketItemList[i])
      }
    }
    // console.log(Items)
    setDisplayMarket(marketItems)
  },[marketPageTotal])

  const handleMarketPage = (i) =>{
    marketItems = []
    if(marketPage == marketPageTotal) {
      for(var i=(marketPage-1)*20;i<marketItemList.length;i++) {
        marketItems.push(i)
      }
      setDisplayMarket(marketItems)
      return
    } else if(marketPageTotal > 0) {
      for(var i=(marketPage-1)*20;i<(marketPage-1)*20+20;i++) {
        marketItems.push(i)
      }
      setDisplayMarket(marketItems)
    }
  }

  useEffect(()=> {
    handleMarketPage(marketPage)
  },[marketPage])
  return (
    <div>
      <Panel>
        <h2>MARKET PLACE</h2>
        <div className='page-btn'>
          {
            marketPages.map((i)=>(
              <a className={marketPage == i?'active':'inactive'} onClick={()=>{
                setMarketPage(i)
              }}>{i}</a>
            ))
          }
        </div>
        {
        loading == 1 ? (<div className='item-list'>
          {
            displayMarket.map((item)=>(
              <Item 
                userId = {user ? user.user_id:''}
                sellerId = {item ? item.user_id:''}
                userPhotoURL = {item ? item.photourl:''}
                userDisplayName = {item ? item.name:''}
                userEmail = {item ? item.email:''}
                productTime = {item ? item.time:''}
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
            marketPages.map((i)=>(
              <a className={marketPage == i?'active':'inactive'} onClick={()=>{
                setMarketPage(i)
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
  grid-template-columns: repeat(3,1fr);
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
    .item-list{
      grid-template-columns: 1fr;
    }
  }
`

export default Main
