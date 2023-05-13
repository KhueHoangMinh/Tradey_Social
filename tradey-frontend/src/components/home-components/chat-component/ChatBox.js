import React, {useState,useEffect} from "react";
import Axios from 'axios'
import styled from "styled-components";

function ChatBox(props) {
    const [message,setMessage] = useState()
    const [other,setOther] = useState()
    const [messages,setMessages] = useState([])

    useEffect(()=>{
        Axios.post('/api/getuserbyid', {userId: props.chatting})
        .then(res=>{
            setOther(res.data[0])
        })
        Axios.post('/api/getmessages', {userId: props.userId, chatting: props.chatting})
        .then(res => {
            var processMessages = []
            for(var i = 0; i< res.data.length; i++) {
                    processMessages.push({senderId: res.data[i].sender_id,receiverId: res.data[i].receiver_id,message: res.data[i].message,time: res.data[i].time})
                }
            setMessages(processMessages)
        })

        window.socket.emit('joinchat', {userId: props.userId, chatting: props.chatting})


    },[props.chatting])

    useEffect(()=>{
        var messageElement = document.getElementById(props.userId.toString() + props.chatting.toString())
        messageElement.scrollTop = messageElement.scrollHeight
    },[messages])

    useEffect(()=>{
        window.socket.on('receivemessage', (req) => {
        
            setMessages((list) => {
                if(list.length == 0 || list[list.length-1] != req){
                    return [...list, req]
                } else {
                    return list
                }
            })
        })
    },[window.socket])

    const send = (e) => {
        e.preventDefault()

        if(message && message != "") {
            var time = Date.now().toString()
            setMessages((list)=>[...list, {senderId: props.userId, receiverId: props.chatting, message: message, time: time}])
            window.socket.emit('sendmessage', {userId: props.userId, chatting: props.chatting, message: message, time: time})
            setMessage("")
        }
        var messageElement = document.getElementById(props.userId.toString() + props.chatting.toString())
        messageElement.scrollTop = messageElement.scrollHeight
    }

    const close = () => {
        // socket.disconnect()
        // setSocket(null)
        props.setChatting(null)
    }

    return(
        <ChatBoxStyle>
            <div className="box-head">
                <div className="user-info">
                    <img className='user-image' src={other ? (other.photourl ? window.host + other.photourl : '/images/user.png') : '/images/user.png'} alt=''/>
                    <div>
                        <h3>{other && other.name}</h3>
                        <span>{other && other.email}</span>
                    </div>
                </div>
                <button onClick={close}>
                    <img src='/images/close.svg' alt=''/>
                </button>
            </div>
            <div className="box-body">
                <div className='messages' id={props.userId.toString() + props.chatting.toString()}>
                    {
                        messages.map((messageContent,index) => (
                            <div className="message" key={index}>
                                <div className={`message-content ${messageContent.senderId == props.userId ? `user` : `other`}`}>
                                    <h3>{messageContent.senderId == props.userId ? 'You' : other && other.name}</h3>
                                    <p>{messageContent.message}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <form className="input" onSubmit={(e) => {send(e)}}>
                    <input type='text' value={message} onChange={e=>{setMessage(e.target.value)}} />
                    <button type="submit">Send</button>
                </form>
            </div>
        </ChatBoxStyle>
    )
}

const ChatBoxStyle = styled.div`
width: 400px;
height: fit-content;
background-color: rgb(10,10,10);
border-radius: 20px;
overflow: hidden;
box-shadow: 5px 5px 5px rgba(0,0,0,0.4);
position: relative;
.box-head {
    background-color: rgb(50,50,50);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: calc(100% - 40px);
    position: relative;
    .user-info {
        display: flex;
        flex-direction: row;
        div{
            display: flex;
            flex-direction: column;
            h3 {
            padding: 0;
            margin: 0;
            margin-bottom: 2px;
            }

            span {
            color: rgb(180,180,180);
            font-size: 13px;
            }
        }
        img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }
    button {
        padding: 10px;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        background-color: transparent;
        transition: 0.2s ease-in-out;
        position: absolute;
        border: none;
        right: 20px;
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
.box-body {
width: 100%;
bottom: 0;
.messages {
    padding: 0 10px;
    width: calc(100% - 10px);
    height: 400px;
    bottom: 0;
    overflow-y: scroll;
    position: relative;
    ::-webkit-scrollbar {
    display: none;
    }
    .message {
        background-color: transparent;
        margin-bottom: 10px;
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        .message-content {
            max-width: 80%;
            background-color: transparent;
            display: flex;
            flex-direction: column;
            top: 0;
            height: fit-content;
            position: relative;
            h3 {
                padding: 0;
                margin: 0;
                font-size: 14px;
                margin-bottom: 3px;
            }
            p {

                padding: 10px;
                margin: 0;
                color: black;
                background-color: white;
                border-radius: 10px;
                width: fit-content;
                max-width: 100%;
            }
        }
        .user {
            align-self: flex-end;
            h3 {
                text-align: right;
            }
            p {
                align-self: flex-end;
                margin-right: 10px;
                border-radius: 12px 0px 12px 12px;
            }
        }
        .other {
            align-self: flex-start;
            h3 {
                text-align: left;
            }
            p {
                align-self: flex-start;
                margin-left: 10px;
                background-color: rgba(255,255,255,0.1);
                color: white;
                float: right;
                border-radius: 0px 12px 12px 12px;
            }
        }
    }
}
.input {
    display: flex;
    flex-direction: row;
    padding: 5px 20px;
    width: calc(100% - 40px);
    background-color: rgb(50,50,50);
    input {
        width: 100%;
        margin-right: 10px;
        outline: none;
        padding: 10px 5px;
        border-radius: 10px;
        background-color: rgb(10,10,10);
        color: white;
        border: none;
    }
    button {
        color: white;
        background-color: transparent;
        border-radius: 10px;
        font-weight: 600;
        padding: 10px 5px;
        border: none;
        transition: 0.2s ease-in-out;
        &:hover {
            background-color: white;
            color: black;
        }
    }
}
}
`

export default ChatBox