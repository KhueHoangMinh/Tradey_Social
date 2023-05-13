import React, { useState ,useEffect} from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Axios  from 'axios'
import Button from '../Button'
import { useNavigate } from 'react-router-dom'
import { SearchPanel } from '../market-component/Leftside'
import { User } from './RightSide'
import Loading from '../Loading'

function HighlightedItem(props) {
  const navigate = useNavigate()

  const handleNav = () => {
    navigate('/marketproduct',{state: {
      productId: props.productId,
      type: props.type
    }})
  }

  return (
    <HighlightedItemStyle onClick={handleNav}>
      <img src={window.host + props.image} alt=''/>
      <div className='product-info'>
        <h2>{props.name}</h2>
        <span>{props.description}</span>
      </div>
    </HighlightedItemStyle>
  )
}

function LeftSide(props) {
  const user = useSelector(state=>state.auth.user)
  const [postText,setPostText] = useState()
  const [image,setImage] = useState(null)
  const [video,setVideo] = useState(null)
  const [highlighted,setHighlighted] = useState()
  const [highlightedList,setHighlightedList] = useState([])
  const [hightlightedLoading, setHightlightedLoading] = useState(0)
  const [searchInput,setSearchInput] = useState()
  const [searchResult,setSearchResult] = useState(null)
  const [searchLoading, setSearchLoading] = useState(1)
  const [postLoading, setPostLoading] = useState(1)
  const navigate = useNavigate()
  const date = new Date()

  useEffect(()=>{
    Axios.post('/api/gethighlighted')
    .then(res=>{
      setHighlighted(res.data[0])
      setHighlightedList(res.data.slice(1,res.data.length-1))
    })
  },[])

  const postArticle = (e)=>{
    e.preventDefault()
    setPostLoading(0)
    Axios.post('/api/post', {
      publisherId: user.user_id,
      description: postText,
      image: image,
      video: video,
      type: 'post',
    },{
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res=>{
      setPostText(null)
      setImage(null)
      setVideo(null)
      setPostLoading(1)
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("seraching")
    setSearchLoading(0)
    Axios.post('/api/searchuser', {name: searchInput})
    .then(res=> {
      setSearchResult(res.data)
      setSearchLoading(1)
    })

  }

  const viewUserPage = (userId) => {
    navigate('/about',{state: {
      userId: userId
    }})
  }

  return (
    <LeftSideStyle>
      <Panel onSubmit={e=>postArticle(e)}>
          <div className="loading-box">
              {
                  !postLoading ? (
                      <Loading
                          width = {8}
                      />
                  ) :''
              }
          </div>
          <div className='userinfo'>
            <img src={user ? (user.photoURL ? (window.host + user.photoURL):'/images/user.png') : '/images/user.png'} alt=''/>
            <div>
              <h3>{user ? user.displayName : ''}</h3>
              <span>{user ? user.email : ''}</span>
            </div>
          </div>
          <textarea type='text' value={postText} onChange={(e)=>{setPostText(e.target.value)}} rows='3' placeholder='Write something...'/>
          {image && 
          <img src={URL.createObjectURL(image)} alt=''/>}
          {video && 
            <video controls>
              <source src={URL.createObjectURL(video)} type='video'/>
            </video>}
          <div className='buttons'>
            <div>
              <label className='imgbtn'>
                <img src='/images/image.svg' alt=''/>
                Image
                <input name='uploadedImage' type='file' style={{display: 'none'}} onChange={e=>setImage(e.target.files[0])}/>
              </label>
              {/* <label className='vidbtn'>
                <img src='/images/video.svg' alt=''/>
                Video
                <input name='uploadedVideo' type='file' style={{display: 'none'}} onChange={e=>setVideo(e.target.files[0])}/>
              </label> */}
            </div>
            <button
              className='postbtn'
              type='submit'
            >Post</button>
          </div>
      </Panel>
      <SearchPanel onSubmit={e=>handleSearch(e)}>
          <input type='text' value={searchInput} placeholder='Search for users...' onChange={e=>setSearchInput(e.target.value)}/>
          <button type='submit'><img src='/images/search.svg' alt=''/></button>
      </SearchPanel>
      {
        searchResult &&
        <div className='result-header'>
          <h2>Found {searchResult.length} result{searchResult.length > 1 && 's'}</h2>
          <button className="close-btn" onClick={()=>setSearchResult(null)}>
              <img src='/images/close.svg' alt=''/>
          </button>
        </div>
      }
      {
        searchLoading === 1 ? (searchResult && searchResult.map(userInfo => (
          <User className='user-item' onClick={()=>{viewUserPage(userInfo.user_id)}}>
            <div className='user-bg'>
              <img className='user-image' crossOrigin='use-credentials' src={userInfo.photourl ? window.host + userInfo.photourl : '/images/user.png'} alt=''/>
              <div>
                <h3>{userInfo.name}</h3>
                <span>{userInfo.email}</span>
              </div>
            </div>
          </User>
        ))): <Loading></Loading>
      }
      <h2>Highlighted Products</h2>
      <Highlighted>
          {
            highlighted && 
            <HighlightedItem
              productId = {highlighted.product_id}
              name = {highlighted.product_name}
              image = {highlighted.image}
              description = {highlighted.description}
              type = {highlighted.type}
            />
          }
          <div className='highlighted-list'>
            {
              highlightedList.map(item => (
                <HighlightedItem
                  productId = {item.product_id}
                  name = {item.product_name}
                  image = {item.image}
                  description = {item.description}
                  type = {item.type}
                />
              ))
            }
          </div>
      </Highlighted>
    </LeftSideStyle>
  )
}

const Highlighted = styled.div`
height: fit-content;
.highlighted-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}
@media (max-width: 1200px) {
  display: none;
}
`
const HighlightedItemStyle = styled.div`
position: relative;
width: 100%;
height: fit-content;
border-radius: 10px;
box-shadow: 5px 5px 5px rgba(0,0,0,0.4);
overflow: hidden;
transition: 0.2s ease-in-out;
display: flex;
align-items: center;
justify-content: center;
&::after {
  content: "";
  padding-top: 65%;
  display: block;
}
img {
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: cover;
  filter: grayscale(0.8) brightness(0.6);
  transition: 0.2s ease-in-out;
}
.product-info {
  position: absolute;
  bottom: -100%;
  padding: 20px;
  height: fit-content;
  width: calc(100% - 40px);
  background: linear-gradient(0deg, rgba(10,10,10,1), rgba(10,10,10,0.8),rgba(0,0,0,0));
  transition: 0.2s ease-in-out;
  h2 {
    padding: 0;
    margin: 0;
    margin-bottom: 2px;
    width: 100%;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  span {
    line-height: 15px;
    height: 30px;
    width: 100%;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
&:hover {
  cursor: pointer;
  img {
    height: 120%;
    width: 120%;
    filter: grayscale(0) brightness(1);
  }
  .product-info {
    bottom: 0;
  }
}
`

const LeftSideStyle = styled.div`
overflow: visible;
overflow-y: scroll;
height: calc(100vh - 120px);
width: calc(100% - 20px);
padding: 0 10px;
::-webkit-scrollbar {
  display: none;
}
.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  h2 {
    padding: 0;
    margin: 0;
  }
  .close-btn {
      padding: 10px;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      background-color: transparent;
      transition: 0.2s ease-in-out;
      position: relative;
      border: none;
      img {
          height: 100%;
          width: 100%;
          object-fit: cover;
      }
      &:hover {
          background-color: rgba(255,255,255,0.2);
          cursor: pointer;
      }
  }
}
@media (max-width: 1200px) {
  padding: 0;
  overflow: unset;
  height: fit-content;
}
`

const Panel = styled.form`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 5px rgba(0,0,0,0.4);
padding: 30px;
display: flex;
flex-direction: column;
position: relative;
width: calc(100% - 60px);
height: fit-content;
margin-bottom: 20px;
.loading-box {
    position: absolute;
    right: 20px;
}
.userinfo {
  display: flex;
  flex-direction: row;
  margin: 10px 0;

  div{
    display: flex;
    flex-direction: column;
    h3 {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
    }

    span {
      color: rgb(200,200,200);
      font-size: 15px;
    }
  }
  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

textarea {
background-color: transparent;
border: none;
height: fit-content;
padding: 10px;
margin-bottom: 20px;
color: white;
outline: none;
line-height: 18px;
resize: none;
}

label {
  color: rgb(230,230,230);
  font-weight: 600;
  width: 60px;
  height: 30px;
  padding: 2px 5px;
  transition: 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}


.buttons {
  display: inline-flex;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    button {
      width: 70px;
    }
    .imgbtn {
      img {
        margin-right: 2px;
        width: 18px;
      }
      width: fit-content;
      height: fit-content;
      padding: 12px 18px;
      color: white;
      transition: 0.2s ease-in-out;
      background-color: transparent;
      border-radius: 25px;
      font-size: 20px;
      font-weight: 700;
      border: none;
      &:hover {
        cursor: pointer;
        background-color: white;
        color: black;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
      }
    }
    .vidbtn {
      img {
        margin-right: 2px;
        width: 10px;
      }
      width: fit-content;
      height: fit-content;
      padding: 12px 18px;
      color: white;
      transition: 0.2s ease-in-out;
      background-color: transparent;
      border-radius: 25px;
      font-size: 20px;
      font-weight: 700;
      border: none;
      &:hover {
        cursor: pointer;
        background-color: white;
        color: black;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
      }
    }
  }
  .postbtn {
    width: fit-content;
    height: fit-content;
    padding: 12px 18px;
    color: white;
    transition: 0.2s ease-in-out;
    background-color: transparent;
    border-radius: 25px;
    font-size: 20px;
    font-weight: 700;
    border: none;
    &:hover {
      cursor: pointer;
      background-color: white;
      color: black;
      box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
    }
  }
}
@media (max-width: 1200px) {
  position: relative;
  width: calc(100% - 60px);
}
`

export default LeftSide
