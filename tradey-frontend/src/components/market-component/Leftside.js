import styled from 'styled-components'


export const LeftSide = styled.div`
background-color: transparent;
display: flex;
flex-direction: column;
position: sticky;
top: 100px;
left: 10px;
width: 100%;
height: calc(100vh - 180px);
@media (max-width: 1200px) {
  position: relative;
  width: calc(100% - 20px);
}
`

export const SearchPanel = styled.div`
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
display: flex;
flex-direction: row;
height: 60px;
align-items: center;
width: 100%;
margin-bottom: 20px;
height:50px;
padding: 0;
overflow: hidden;
  border-radius: 10px;
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
  background-color: transparent;
  transition: 0.2s ease-in-out;
  z-index: 10;
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
  outline: none;
  &::placeholder {
    letter-spacing: 2px;
  }
  &:active {
    border: none;
  }
  &:focus {
    border: none;
  }
}
`

export const FilterPanel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
padding: 30px;
display: flex;
flex-direction: column;
align-items: center;
width: calc(100% - 60px);
margin-bottom: 20px;
h2 {
  text-align: center;
  width: 100%;
  margin: 0px;
  padding-bottom: 5px;
  color: rgb(51,255,255);
  letter-spacing: 3px;
}
.option-box {
  width: 100%;
  margin: 20px 0;
  display: flex;
  height: 30px;
  align-items: center;
  h3 {
    padding: 0;
    margin: 0;
    margin-right: 10px;
  }
  select {
    width: 100%;
    height: 100%;
    outline: none;
    border-radius: 4px;
    color: white;
    background-color: rgba(90,90,90);
    border: none;
    option {
      border-radius: 4px;
      border: none;
    }
  }
}
@media (max-width: 1200px) {
  position: relative;
  width: calc(100% - 60px);
}
`

export const PagePanel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
padding: 20px;
display: flex;
flex-direction: column;
height: fit-content;
align-items: center;
width: calc(100% - 40px);
margin-bottom: 20px;
.page-btn {
    margin: 5px auto;
    a {
      margin: 0 5px;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      user-select: none;
      transition: 0.2s ease-in-out;
      font-size: 18px;
      font-weight: 600;
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


