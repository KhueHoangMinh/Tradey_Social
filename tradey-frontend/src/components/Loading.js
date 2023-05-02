import styled from "styled-components";
import React from "react";

function Loading(props) {
    const LoadRing = styled.div`
        display: inline-block;
        position: relative;
        width: ${props.width ? `${props.width}px`:`80px`};
        height: ${props.width ? `${props.width}px`:`80px`};
        margin: 0 calc(50% - 40px);
        div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: ${props.width ? `${props.width - 16}px`:`64px`};
            height: ${props.width ? `${props.width - 16}px`:`64px`};
            margin: 8px;
            border: 8px solid #fff;
            border-radius: 50%;
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #fff transparent transparent transparent;
        }
        div:nth-child(1) {
            animation-delay: -0.45s;
        }
        div:nth-child(2) {
            animation-delay: -0.3s;
        }
        div:nth-child(3) {
            animation-delay: -0.15s;
        }
        @keyframes lds-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `
    return (
        <LoadRing>
            <div></div><div></div><div></div><div></div>
        </LoadRing>
    )
}


export default Loading