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

  return (
    <div>
      <Panel>
        {
        props.loading === 1 ? (<div className='item-list'>
          {
            props.marketItemList.map((item)=>(
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
                type={item ? item.type:''}
              />
            ))
          }
        </div>) : <Loading></Loading>
        }
      </Panel>
    </div>
  )
}

const Panel = styled.div`
background-color: transparent;
display: flex;
flex-direction: column;
justify-content: center;
h2 {
  width: 100%;
  margin: 0px;
  padding-bottom: 5px;
  color: rgb(51,255,255);
  letter-spacing: 3px;
}
.item-list {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;
}
@media (max-width: 1200px) {
  .item-list {
      display: flex;
      flex-direction: column;
  }
}
`

export default Main
