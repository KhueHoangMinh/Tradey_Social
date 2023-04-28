import React from 'react'
import styled from 'styled-components'

function Leftside() {
  return (
    <div>
      <Panel>
        <h2>Filter</h2>
        <div className='option-box'>
          <div className='brand option'>
              <h3>Brand:</h3>
              <ul>
                <li>
                  <input type='checkbox' id='rolls-royce' value='rolls-royce'/>
                  <label for='roll-royce'>Rolls Royce</label>
                </li>
                <li>
                  <input type='checkbox' id='range-rover' value='range-rover'/>
                  <label for='range-rover'>Range Rover</label>
                </li>
                <li>
                  <input type='checkbox' id='lamborgini' value='lamborgini'/>
                  <label for='lamborgini'>Lamborgini</label>
                </li>
                <li>
                  <input type='checkbox' id='mercedes' value='mercedes'/>
                  <label for='mercedes'>Mercedes</label>
                </li>
                <li>
                  <input type='checkbox' id='lexus' value='lexus'/>
                  <label for='lexus'>Lexus</label>
                </li>
              </ul>
          </div>
          <div className='brand option'>
              <h3>Engine:</h3>
              <ul>
                <li>
                  <input type='checkbox' id='v6' value='v6'/>
                  <label for='v6'>V6</label>
                </li>
                <li>
                  <input type='checkbox' id='v7' value='v7'/>
                  <label for='v7'>V7</label>
                </li>
                <li>
                  <input type='checkbox' id='v8' value='v8'/>
                  <label for='v8'>V8</label>
                </li>
                <li>
                  <input type='checkbox' id='v9' value='v9'/>
                  <label for='v9'>V9</label>
                </li>
              </ul>
          </div>
          <div className='brand option'>
              <h3>Car Type:</h3>
              <ul>
                <li>
                  <input type='checkbox' id='sedan' value='sedan'/>
                  <label for='sedan'>Sedan</label>
                </li>
                <li>
                  <input type='checkbox' id='suv' value='suv'/>
                  <label for='suv'>SUV</label>
                </li>
                <li>
                  <input type='checkbox' id='hatchback' value='hatchback'/>
                  <label for='hatchback'>Hatchback</label>
                </li>
                <li>
                  <input type='checkbox' id='convertible' value='convertible'/>
                  <label for='convertible'>Convertible</label>
                </li>
                <li>
                  <input type='checkbox' id='sport' value='sport'/>
                  <label for='sport'>Sport</label>
                </li>
              </ul>
          </div>
        </div>
        <button className='savebtn'>Save</button>
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
position: fixed;
width: calc(20% - 80px);
height: calc(100vh - 180px);
align-items: center;
h2 {
  text-align: center;
  width: 100%;
  margin: 0px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
  padding-bottom: 5px;
  color: rgb(51,255,255);
  letter-spacing: 3px;
}
.option-box {
  width: calc(100% + 30px);
  height: 90%;
  overflow-y: hidden scroll;
  overflow-x: hidden;
  margin: 20px 0;
  background-color: rgba(255,255,255,0.1);
  padding: 10px;
  .option {
    h3 {
      border-bottom: 1px solid rgba(255,255,255,0.6);
    }
    li {
      list-style: none;
    }
    ul {
      display: flex;
      flex-direction: column;
    }
  }
}
.savebtn {
  color: white;
  background-color: rgba(51,255,255,0.3);
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: rgba(51,255,255,0.6);
  }
}
@media (max-width: 1200px) {
  position: relative;
  width: calc(100% - 60px);
}
`

export default Leftside
