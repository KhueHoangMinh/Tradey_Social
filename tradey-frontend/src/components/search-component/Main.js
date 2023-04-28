import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import ShopItem from '../shop-component/Item' 
import MarketItem from '../market-component/Item' 
import { useDispatch, useSelector } from 'react-redux'
import { displayItemsActions } from '../../store/displayitem-slice'
import Axios from 'axios'
import Loading from '../Loading'

function Main(props) {
  const dispatch = useDispatch()
  const [searchInput, setSearchInput] = useState()
  const [shopItemList, setShopItemList] = useState([])
  const [marketItemList, setMarketItemList] = useState([])
  const [loadingShop,setLoadingShop] = useState(1)
  const [loadingMarket,setLoadingMarket] = useState(1)
  const user = useSelector(state=>state.auth.user)

  const handleSearch = (e) => {
    e.preventDefault()
    setLoadingShop(0)
    Axios.post('/api/shopsearch', {input: searchInput})
    .then(res=>{
      console.log(res.data)
      setShopItemList(res.data)
      setLoadingShop(1)
      
      Axios.post('/api/marketsearch', {input: searchInput})
      .then(res=>{
        console.log(res.data)
        setMarketItemList(res.data)
        setLoadingMarket(1)
      })
    })
  }


  const [shopPage,setShopPage] = useState(1)
  const [displayShop,setDisplayShop] = useState([])
  const [shopPages, setShopPages] = useState([])
  const [shopPageTotal, setShopPageTotal] = useState(0)
  
  var Pages = []
  var shopItems = []

  useEffect(()=>{
    // Axios.get('/api/getshop')
    // .then(res=>{
    //   setShopItemList(res.data)
    // })
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
  },[shopPageTotal,shopItemList])


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


  const [marketPage,setMarketPage] = useState(1)
  const [displayMarket,setDisplayMarket] = useState([])
  const [marketPages, setMarketPages] = useState([])
  const [marketPageTotal, setMarketPageTotal] = useState(0)
  
  var Pages = []
  var marketItems = []

  useEffect(()=>{
    // Axios.get('/api/getmarket')
    // .then(res=>{
    //   setMarketItemList(res.data)
    // })
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
  },[marketPageTotal,marketItemList])

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
      <SearchPanel>
        <form className='search-bar' onSubmit={e=>handleSearch(e)}>
          <h2>SEARCH</h2>
          <input type='text' placeholder='What are you looking for?' onChange={e=>setSearchInput(e.target.value)}/>
          <button type='submit'><img src='/images/search.svg' alt=''/></button>
        </form>
      </SearchPanel>
      <MainPanel>
        <h2>Results</h2>
        <div className='result'>
          <h3 className='result-header'>Shop</h3>
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
          loadingShop == 1 ?(<div className='item-list'>
            {
               displayShop.map((item)=>(
                <ShopItem 
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
          <h3 className='result-header'>Market</h3>
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
        loadingMarket == 1 ? (<div className='item-list market'>
          {
            displayMarket.map((item)=>(
              <MarketItem
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
        </div>
      </MainPanel>
    </div>
  )
}

const SearchPanel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
padding: 30px;
margin-bottom: 20px;
height: 60px;
display: flex;
align-items: center;
justify-content: center;
.search-bar {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height:50px;
  width: 90%;
  background-color: rgba(255,255,255,0.1);
  padding: 0;
  border-radius: 25px;
  h2 {
    width: 130px;
    margin: 0px;
    color: rgb(51,255,255);
    letter-spacing: 3px;
    padding: 0 20px;
  }
  button {
    height: 100%;
    width: 80px;
    border: none;
    border-radius: 0 25px 25px 0;
    background-color: transparent;
    transition: 0.2s ease-in-out;
    img {
      height:30px;
    }
    &:hover {
      background-color: rgba(255,255,255,0.2);
    }
  }
  input {
    height: 100%;
    width: 100%;
    border: none;
    padding: 0;
    background-color: rgba(255,255,255,0.1);
    padding: 0 20px;
    color: rgb(200,200,200);
    &::placeholder {
      letter-spacing: 2px;
    }
  }
}
`

const MainPanel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
padding: 30px;
h2 {
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
  padding-bottom: 5px;
  color: rgb(51,255,255);
  letter-spacing: 3px;
}
.result {
  display: flex;
  flex-direction: column;
  .result-header {
    margin: 10px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    letter-spacing: 2px;
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
}
.item-list {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
}
.market {
  grid-template-columns: repeat(3,1fr);
}
`

export default Main
