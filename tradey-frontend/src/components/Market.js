import React, {useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Main from './market-component/Main'
import { LeftSide, SearchPanel, FilterPanel, PagePanel } from './market-component/Leftside'

function Market() {
  const user = useSelector(state=>state.auth.user)
  const [loading,setLoading] = useState(0)
  const [marketItemList, setMarketItemList] = useState([])
  const [marketPage,setMarketPage] = useState(1)
  const [displayMarket,setDisplayMarket] = useState([])
  const [marketPageTotal, setMarketPageTotal] = useState(0)

  useEffect(()=>{
    Axios.get('/api/getmarket')
    .then(res=>{
      setMarketItemList(res.data)
      setLoading(1)
    })
  },[])
  const navigate = useNavigate()
  useEffect(()=>{
    if(user == null) {
      navigate('/')
    }
  },[])

  
  const [searchInput, setSearchInput] = useState()
  
  const handleSearch = (e) => {
    e.preventDefault()

    setLoading(0)
    Axios.post('/api/search', {input: searchInput, filter: 'date_down'})
    .then(res=>{
      setMarketPage(1)
      setMarketItemList(res.data)
      setLoading(1)
    })
  }



// =========================== calculate pages =========================== 
  
  var Pages = []
  var marketItems = []


  useEffect(()=>{
    if(marketItemList.length > 0 ) {
      setMarketPageTotal(Math.ceil(marketItemList.length/21.0))
    }
    marketItems = []
    if(marketItemList.length > 21) {
      for(var i=0;i<21;i++) {
        marketItems.push(marketItemList[i])
      }
    } else {
      for(var i=0;i<marketItemList.length;i++) {
        marketItems.push(marketItemList[i])
      }
    }
    setDisplayMarket(marketItems)
  },[marketItemList])

  const handleMarketPage = (page) =>{
    marketItems = []
    if(page == marketPageTotal) {
      for(var i=(page-1)*21;i<marketItemList.length;i++) {
        marketItems.push(marketItemList[i])
      }
      setDisplayMarket(marketItems)
      return
    } else if(marketPageTotal > 0) {
      for(var i=(page-1)*21;i<(page-1)*21+21;i++) {
        marketItems.push(marketItemList[i])
      }
      setDisplayMarket(marketItems)
    }
  }

  useEffect(()=> {
    handleMarketPage(marketPage)
  },[marketPage])

  function PageBtn (i,cur,set) {
    return ( 
      <a id={`page-btn-${i}`} className={cur == (i)?'active':'inactive'} onClick={(e)=>{
        e.preventDefault()
        set(i)
        }}>{i}
      </a>
    )
  }
  
  function displayPages(total,currentPage) {
    var pages = []

    for(var i = 1; i <= total; i++) {
      pages.push(PageBtn(i,currentPage,setMarketPage))
    }
    return pages
  }
// =========================== calculate pages =========================== 


const [filter,setFilter] = useState()

useEffect(()=>{
  setLoading(0)
  Axios.post('/api/search', {input: searchInput, filter: filter})
  .then(res=>{
    setMarketPage(1)
    setMarketItemList(res.data)
    setLoading(1)
  })
},[filter])



  return (
    <div>
        <MarketPage>
          <LeftSide>
            <SearchPanel onSubmit={e=>handleSearch(e)}>
                <input type='text' placeholder='What are you looking for?' onChange={e=>setSearchInput(e.target.value)}/>
                <button type='submit'><img src='/images/search.svg' alt=''/></button>
            </SearchPanel>
            <FilterPanel>
              <h2>Filter</h2>
              <div className='option-box'>
                  <h3>Sort:</h3>
                  <select name='sort' id='sort' onChange={(e=>setFilter(e.target.value))}>
                    <option value=''>None</option>
                    <option value='price_up'>Price low - high</option>
                    <option value='price_down'>Price high - low</option>
                    <option value='name_up'>Name A - Z</option>
                    <option value='name_down'>Name Z - A</option>
                    <option value='date_up'>New - Old</option>
                    <option value='date_down'>Old - New</option>
                  </select>
              </div>
            </FilterPanel>
            <PagePanel>
              
              <div className='page-btn'>
                <a id='prev-btn' className='inactive' onClick={(e)=>{
                  e.preventDefault()
                  if(marketPage == 1) {
                    setMarketPage(marketPageTotal)
                  } else {
                    setMarketPage(marketPage - 1)
                  }
                  }}>&lt;&lt;
                </a>
                {
                  displayPages(marketPageTotal,marketPage)
                }
                <a id='next-btn' className='inactive' onClick={(e)=>{
                  e.preventDefault()
                  if(marketPage == marketPageTotal) {
                    setMarketPage(1)
                  } else {
                    setMarketPage(marketPage + 1)
                  }
                  }}>&gt;&gt;
                </a>
              </div>
            </PagePanel>
          </LeftSide>
          <Main 
            user={user}
            marketItemList = {displayMarket}
            loading = {loading}/>
        </MarketPage>
    </div>
  )
}

const MarketPage = styled.div`
position: relative;
display: grid;
grid-template-columns: 1fr 4fr;
padding: 20px;
gap: 20px;
top: 80px;
background-image: radial-gradient(farthest-corner at 75% 70%, rgb(20,20,20), rgb(25,25,25));
min-height: calc(100vh - 80px);
height: fit-content;
color: rgb(230,230,230);
@media (max-width: 1200px) {
  display: flex;
  flex-direction: column;
}
`

export default Market
