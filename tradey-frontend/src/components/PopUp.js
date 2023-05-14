import React,{useState,useEffect} from "react";
import styled from "styled-components";

function PopUp(props) {
    return (
        <PopUpStyle>
            <div className="bg" onClick={()=>props.close()}></div>
            <Content>
                <button className="close-btn" onClick={()=>props.close()}>
                    <img src='/images/close.svg' alt=''/>
                </button>
                {props.content}
            </Content>
        </PopUpStyle>
    )
}

const Content = styled.div`
height: fit-content;
width: fit-content;
max-width: 80vw;
padding: 30px;
border-radius: 15px;
background-color: rgb(20,20,20);
box-shadow: 5px 5px 5px rgba(0,0,0,0.6);
z-index: 1001;
position: relative;
.close-btn {
    padding: 10px;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    background-color: transparent;
    transition: 0.2s ease-in-out;
    position: absolute;
    border: none;
    top: 6px;
    right: 6px;
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
`

const PopUpStyle = styled.div`
top: 0;
left: 0;
position: fixed;
height: 100vh;
width: 100vw;
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
.bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.7);
    z-index: 1000;
}
`

export default PopUp
