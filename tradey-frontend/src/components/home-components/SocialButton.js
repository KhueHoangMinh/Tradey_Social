import React from 'react'
import styled from 'styled-components'

function ReactButton(props) {
    return (
        <ReactButtonStyle>
            <div className='react-btns'>
                <div className='other-reacts'>
                    <button onClick={()=>props.handleLike('like')} className={props.liked && props.liked.type == 'like' ? `other like liked`:'other like'}>
                        <img src='/images/like.svg' alt=''/>
                    </button>
                    <button onClick={()=>props.handleLike('love')} className={props.liked && props.liked.type == 'love' ? `other love liked`:'other love'}>
                        <img src='/images/love.svg' alt=''/>
                    </button>
                    <button onClick={()=>props.handleLike('haha')} className={props.liked && props.liked.type == 'haha' ? `other haha liked`:'other haha'}>
                        <img src='/images/haha.svg' alt=''/>
                    </button>
                    <button onClick={()=>props.handleLike('wow')} className={props.liked && props.liked.type == 'wow' ? `other wow liked`:'other wow'}>
                        <img src='/images/wow.svg' alt=''/>
                    </button>
                    <button onClick={()=>props.handleLike('sad')} className={props.liked && props.liked.type == 'sad' ? `other sad liked`:'other sad'}>
                        <img src='/images/sad.svg' alt=''/>
                    </button>
                    <button onClick={()=>props.handleLike('angry')} className={props.liked && props.liked.type == 'angry' ? `other angry liked`:'other angry'}>
                        <img src='/images/angry.svg' alt=''/>
                    </button>
                </div>
                <button onClick={()=>props.handleLike('default')} className={props.liked ? `react-btn ${props.liked.type} liked`:' react-btn like'}>
                    <div className='react-count'>
                        {
                            props.mostReact.length > 0 && props.mostReact.map(react => (
                                <>
                                {
                                    react.quant > 0 ? (
                                        <img src={`/images/${react.react}.svg`} alt=''/>
                                    ):''
                                }
                                </>
                            ))
                        }
                        {props.likes.length}
                    </div>
                    <span className='user-react'>{props.liked ? <img src={`/images/${(props.liked.type)}.svg`} alt=''/>:''} {props.liked ? (props.liked.type):'react'}</span>
                </button>
            </div>
        </ReactButtonStyle>
    )
}

function CommentButton(props) {
    function calcCmtQuant(comments) {
        var total = 0;
        total += comments.length
        for(var i = 0; i < comments.length; i++) {
            total += calcCmtQuant(comments[i].comments)
        }

        return total
    }



    return (
        <ReactButtonStyle>
            <button onClick={()=>props.handleComment()} className={`comment ${props.openning ? `openning`:``}`}>
                <img src='/images/comment.svg' alt=''/>
                <span>{calcCmtQuant(props.comments)} {props.text != 'reply' ? (<>{props.text}{calcCmtQuant(props.comments) > 1 ? 's':''}</>):(<>{calcCmtQuant(props.comments) > 1 ? 'replies':'reply'}</>)}</span>
            </button>
        </ReactButtonStyle>
    )
}

function ShareButton(props) {
    return (
        <ReactButtonStyle>
            <button onClick={()=>props.handleShare()} className={`share ${props.openning ? `openning`:``}`}>
                <img src='/images/share.svg' alt=''/>
                <span>{props.shares} Share{props.shares > 1 ? 's':''}</span>
            </button>
        </ReactButtonStyle>
    )
}

const ReactButtonStyle = styled.div`
button {
    img {
        padding-right: 1px;
    }
    width: fit-content;
    height: fit-content;
    padding: 12px 18px;
    color: white;
    background-color: transparent;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    transition: 0.2s ease-in-out;
    &:hover {
        cursor: pointer;
        background-color: white;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
        transform: scale(1.1);
    }
    &:active {
        transform: scale(1);
    }
}
.react-btns {
    position: relative;
    height: fit-content;
    width: fit-content;
    .like {
        &:hover {
            background-color: rgba(200,200,255,1);
            color: blue;
        }
    }
    .other-reacts:has(.like:hover) {
        background-color: rgba(200,200,255,1);
    }
    .love {
        &:hover {
            background-color: rgba(255,200,200,1);
            color: red;
        }
    }
    .other-reacts:has(.love:hover) {
        background-color: rgba(255,200,200,1);
    }
    .haha {
        &:hover {
            background-color: rgba(255,255,200,1);
            color: yellow;
        }
    }
    .other-reacts:has(.haha:hover) {
        background-color: rgba(255,255,200,1);
    }
    .wow {
        &:hover {
            background-color: rgba(200,255,200,1);
            color: lightgreen;
        }
    }
    .other-reacts:has(.wow:hover) {
        background-color: rgba(200,255,200,1);
    }
    .sad {
        &:hover {
            background-color: rgba(200,200,200,1);
            color: gray;
        }
    }
    .other-reacts:has(.sad:hover) {
        background-color: rgba(200,200,200,1);
    }
    .angry {
        &:hover {
            background-color: rgba(255,220,200,1);
            color: orange;
        }
    }
    .other-reacts:has(.angry:hover) {
        background-color: rgba(255,220,200,1);
    }
    .liked{
        box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
    }
    .liked.like{
        background-color: rgba(200,200,255,1);
        color: blue;
    }
    .liked.love{
        background-color: rgba(255,200,200,1);
        color: red;
    }
    .liked.haha{
        background-color: rgba(255,255,200,1);
        color: rgb(221,221,0);
    }
    .liked.wow{
        background-color: rgba(200,255,200,1);
        color: rgb(110,221,110);
    }
    .liked.sad{
        background-color: rgba(200,200,200,1);
        color: gray;
    }
    .liked.angry{
        background-color: rgba(255,220,200,1);
        color: orange;
    }
    .other-reacts {
        position: absolute;
        border-radius: 25px;
        background-color: rgba(255,255,255,1);
        bottom: 0%;
        left: -8px;
        display: flex;
        flex-direction: row;
        opacity: 0;
        padding: 0;
        transition: 0.3s ease-in-out;
        z-index: 1;
        align-self: center;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            margin: 0px -3px;
            z-index: 1;
            img {
                height: 25px;
                width: 25px;
                object-fit: cover;
            }
        }
        &::after {
            background-color: transparent;
            z-index: 0;
            top: 0;
            left: 0;
            height: 0%;
            width: 0%;
            content: "";
            position: absolute;
            padding-bottom: 50px;
        }
    }
    .react-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        background-color: rgba(50,50,50);
        padding: 0;
        z-index: 2;
        .react-count {
            color: black;
            background-color: white;
            padding: 12px 18px;
            bottom: 0;
            left: -100%;
            border-radius: 25px;
            box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
            @media(max-width: 550px) {
                .liked.like{
                    background-color: rgba(200,200,255,1);
                    color: blue;
                }
                .liked.love{
                    background-color: rgba(255,200,200,1);
                    color: red;
                }
                .liked.haha{
                    background-color: rgba(255,255,200,1);
                    color: rgb(221,221,0);
                }
                .liked.wow{
                    background-color: rgba(200,255,200,1);
                    color: rgb(110,221,110);
                }
                .liked.sad{
                    background-color: rgba(200,200,200,1);
                    color: gray;
                }
                .liked.angry{
                    background-color: rgba(255,220,200,1);
                    color: orange;
                }
            }
        }
        .user-react {
            box-shadow: none;
            padding: 0 15px;
            text-transform: capitalize;
            @media(max-width: 550px) {
                display: none;
            }
        }
    }
    &:hover {
        .other-reacts {
            bottom: 100%;
            padding: 10px 20px;
            opacity: 1;
            button {
                margin: 0 5px;
            }
            &::after {
                height: 100%;
                width: 100%;
            }
        }
    }
    button {
        transition: 0.2s ease-in-out;
        &:hover {
            cursor: pointer;
            background-color: white;
            box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
            transform: scale(1.1);
        }
        &:active {
            transform: scale(1);
        }
    }
}
.comment {
    &:hover {
        background-color: rgba(255,200,200,1);
        color: red;
    }
}
.openning.comment {
    background-color: rgba(255,200,200,1);
    color: red;
}
.openning.share {
    background-color: rgba(200,255,200,1);
    color: green;
}
.share {
    &:hover {
        background-color: rgba(200,255,200,1);
        color: green;
    }
}
`

export {ReactButton,CommentButton,ShareButton}