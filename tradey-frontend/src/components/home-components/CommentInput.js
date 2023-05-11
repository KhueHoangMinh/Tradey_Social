import styled from "styled-components";
import React from "react";
import Loading from '../Loading.js'

function CommentInput(props) {
    return (
        <InputStyle>
            {
                props.showingCommentInput === props.commentFor ? (
                    <form onSubmit={e=>props.handleComment(e)} className='input-comment'>
                        <input type='text' placeholder={props.text} value={props.comment} onChange={(e)=>{
                            e.preventDefault()
                            props.setComment(e.target.value)
                            }}/>
                        <div className="loading-box">
                            {
                                !props.loading ? (
                                    <Loading
                                        width = {8}
                                    />
                                ) :''
                            }
                        </div>
                        <button type="submit">{props.buttonText}</button>
                    </form>
                ) : <></>
            }
        </InputStyle>
    )
}

const InputStyle = styled.div`
.input-comment {
    overflow: hidden;
    border-radius: 10px;
    margin-bottom: 10px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    button {
        color: rgb(230,230,230);
        font-size: 16px;
        font-weight: 600;
        height: 100%;
        padding: 0 20px;
        transition: 0.2s ease-in-out;
        border: none;
        background-color: rgba(255,255,255,0.8);
        color: black;
        &:hover {
            background-color: rgba(255,255,255,1);
        }
    }
    .loading-box {
        position: absolute;
        margin-top: -22px;
        right: 80px;
    }
    input {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        background-image: none;
        background-color: rgba(255,255,255,0.2);
        border: none;
        color: white;
        outline: none;
        &:focus {
            background-color: rgb(80,80,80);
            border: 1px rgba(51,255,255,1);
        }
    }
}
`

export default CommentInput