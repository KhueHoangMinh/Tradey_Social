import React from 'react'
import Posts from './about-component/Posts'
import Post from './home-components/Post'
import styled from 'styled-components'
import { useState } from 'react'

function Item() {
    return (
      <ItemPanel>
        <div className='product-info'>
          <img src='/images/item-image.jpeg' alt=''/>
          <div className='left-info'>
            <div className='info'>
              <label>Name:</label>
              <span className='name'>product name</span>
            </div>
            <div className='info'>
              <label>Description:</label>
              <span className='desc'>product name</span>
            </div>
            <div className='info'>
              <label>Price:</label>
              <span className='price'>product name</span>
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
transition: 0.2s ease-in-out;
&:hover {
    background-color: rgba(255,255,255,0.3);
}
`

function Shop() {
    return (
        <ProductsPage>
            <h2>Your market products</h2>
            <div className='product-list'>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
                <Item/>
            </div>
        </ProductsPage>
    )
}

const ProductsPage = styled.div`
display: flex;
flex-direction: column;
h2 {
  border-bottom: 1px solid rgba(255,255,255,0.6);
}
`

function UserPage() {
    const [active,setActive] = useState('posts')

    const caseByActive = () => {
        switch(active) {
            case 'posts':
                return (<Posts/>)
            case 'shop':
                return (<Shop/>)
            default:
                return (<Posts/>)
        }
    }
  return (
    <div>
      <AboutPage>
        <div></div>
        <LeftSide>
            <UserInfo>
                <img src='/images/user.png' alt=''/>
                <h3>Username</h3>
                <span>useremail@email.com</span>    
            </UserInfo>
            <Tabs>
                <div className='buttons'>
                    <a onClick={()=>{setActive('posts')}}>Posts</a>
                    <a onClick={()=>{setActive('shop')}}>Market</a>
                </div>
            </Tabs>
        </LeftSide>
        {
            active === 'posts'?(
                <div>
                    <Post/>
                    <Post/>
                </div>
            )
            :(
                <RightSide>
                    {caseByActive()}
                </RightSide>)
        }
      </AboutPage>
    </div>
  )
}

const AboutPage = styled.div`
position: relative;
display: grid;
grid-template-columns: 1fr 2fr;
gap: 20px;
top: 80px;
padding: 20px 20%;
background-image: radial-gradient(farthest-corner at 75% 70%, rgb(20,20,20), rgb(25,25,25));
min-height: calc(100vh - 80px);
height: fit-content;
color: rgb(230,230,230);
@media (max-width: 1200px) {
  display: flex;
  flex-direction: column;
  padding: 20px 5%;
}
`

const LeftSide = styled.div`
display: flex;
flex-direction: column;
position: fixed;
width: calc(20vw - 5px);
height: calc(100vh - 120px);
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
@media (max-width: 1200px) {
  position: relative;
  width: calc(100%);
}
`

const RightSide = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
padding: 20px;
`

const UserInfo = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
border-bottom: 1px solid rgba(255,255,255,0.2);
height: 35%;
img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    padding: 10px 0;
}

h3 {
    padding: 5px 0;
    margin: 0;
}
`

const Tabs = styled.div`
padding: 20px 0;
display: flex;
flex-direction: column;
.buttons {
    a {
        padding: 5px 10px;
        background-color: rgba(255,255,255,0.1);
        transition: 0.2s ease-in-out;
        &:hover, .active {
            background-color: rgba(255,255,255,0.2);
        }
    }
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}
`

export default UserPage
