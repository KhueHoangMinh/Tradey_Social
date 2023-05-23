import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Axios from 'axios'
import PopUp from '../PopUp'

function Item(props) {
    return (
      <ItemPanel>
        <div className='product-info'>
          <img src={window.host + props.productImage} alt=''/>
          <div className='left-info'>
            <div className='info'>
              <label>Name:</label>
              <span className='name'>{props.productName}</span>
            </div>
            <div className='info'>
              <label>Link:</label>
              <span className='desc'>{props.productLink}</span>
            </div>
          </div>
        </div>
        <a className='edit-btn'>Edit</a>
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



function Advertisement() {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [image, setImage] = useState()
  const [link, setLink] = useState()
  const [advertisements,setAdvertisements] = useState([])
  const [addPopUp,setAddPopUp] = useState(false)
  const user = useSelector(state=>state.auth.user)
  const date = new Date()

  const handleAdd = (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append('userId', user.user_id)
    data.append('name', name)
    data.append('description', description)
    data.append('image', image)
    data.append('link', link)


    Axios.post('api/posts/postadvertisement', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res=>{
      }
    )
  }

  useEffect(()=>{
    Axios.post('api/posts/getadvertisement', {userId: user.user_id})
    .then(res=> {
      console.log(res.data)
      setAdvertisements(res.data)
    })
  },[])
  return (
    <div>
      <ProductsPage>
        <div className='header'>
          <h2>Advertisements</h2>
          <button className='add-btn' onClick={()=>setAddPopUp(true)}>Add</button>
        </div>
        <div className='product-list'>
          {
            advertisements.map((advertisement)=>(
              <Item
                type = {1}
                productId = {advertisement ? advertisement.ad_id:''}
                productName = {advertisement ? advertisement.name:''}
                productDesc = {advertisement ? advertisement.description:''}
                productImage = {advertisement ? advertisement.image:''}
                productLink = {advertisement ? advertisement.link:''}
              />
            ))
          }
        </div>
      </ProductsPage>
      {
        addPopUp &&
        <PopUp
          close={()=>{setAddPopUp(false)}}
          content={
            <AddPage>
              <h2>Add new Advertisement</h2>
              <div className='new-product-info'>
                <div className='product-info'>
                  <label>Name:</label>
                  <input type='text' onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div className='product-info'>
                  <label>Description:</label>
                  <textarea type='text' onChange={(e)=>{setDescription(e.target.value)}}></textarea>
                </div>
                <div className='product-info'>
                  <label>Link:</label>
                  <input type='text' onChange={(e)=>{setLink(e.target.value)}}/>
                </div>
                <div className='product-info'>
                  <label>Image:</label>
                  <input type='file' onChange={(e)=>{setImage(e.target.files[0])}}/>
                </div>
              </div>
              <button className='add-btn' onClick={e=>handleAdd(e)}>Add</button>
            </AddPage>
          }
        />
      }
    </div>
  )
}

const AddPage = styled.div`
display: flex;
flex-direction: column;
h2 {
}
.new-product-info {
  display: flex;
  flex-direction: column;
  .product-info {
    display: grid;
    grid-template-columns: 120px 1fr;
    margin: 10px 0;
    textarea {
      height: 100px;
    }
    input,textarea {
      background-color: rgba(255,255,255,0.15);
      border: none;
      border-radius: 5px;
      color: white;
    }
    label {
      color: white;
      font-weight: 600;
    }
  }
}

.add-btn {
width: fit-content;
margin: 10px auto;
padding: 5px 20px;
font-weight: 600;
font-size: 20px;
color: white;
border: none;
border-radius: 5px;
background-color: rgba(51,255,255,0.5);
transition: 0.2s ease-in-out;
&:hover {
  background-color: rgba(51,255,255,0.8); 
}
}
`

const ProductsPage = styled.div`
display: flex;
flex-direction: column;
position: relative;

.header {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  background-color: rgb(10,10,10);
  .add-btn {
    width: fit-content;
    margin: 10px 0;
    padding: 5px 20px;
    font-weight: 600;
    font-size: 20px;
    color: white;
    border: none;
    border-radius: 10px;
    background-color: transparent;
    transition: 0.2s ease-in-out;
    &:hover {
      cursor: pointer;
      background-color: white; 
      color: black;
    }
  }
}
.product-list {
  margin-top: 80px;
}
`

export default Advertisement
