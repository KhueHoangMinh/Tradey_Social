import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Axios from 'axios'

function Post(props) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState()
    const [comments, setComments] = useState()
    const [shares, setShares] = useState()
    const img = props.image
    const [showComments,setShowComments] = useState(false)
    const [change,setChange] = useState(false)


    function Comment(props) {
        const [comments,setComments] = useState()
        const [userComment,setUserComment] = useState()
    
        const handleComment = () => {
            Axios.post('/api/comment', {postId: props.postId, userId: props.userId, content: userComment})
            .then(res=>{
                setChange(!change)
            })
        }
    
        useEffect(()=>{
            Axios.post('/api/showcomments', {postId: props.postId})
            .then(res=>{
                console.log(res)
                setComments(res.data)
            })
        },[])
    
        useEffect(()=>{
            Axios.post('/api/showcomments', {postId: props.postId})
            .then(res=>{
                setComments(res.data)
            })
        },[change])
    
        return (
            <CommentSection>
                {comments && comments.map(comment=>(
                    <div className='comment'> 
                        <div className='commenter-info'>
                            <img src={comment.photourl} alt=''/>
                            <div>
                                <h3>{comment.name}</h3>
                                <span>{comment.email}</span>
                            </div>
                        </div>
                        <div className='comment-content'>
                            <span>{comment.content}</span>
                        </div>
                    </div>
                ))}
                <div className='input-comment'>
                    <input type='text' placeholder='write a comment' value={userComment} onChange={(e)=>setUserComment(e.target.value)}/>
                    <button onClick={handleComment}>Send</button>
                </div>
            </CommentSection>
        )
    }

    const handleNav = () => {
        navigate('/user')
    }

    const handleLike = () => {
        Axios.post('/api/like',{postId: props.id, userId: props.userId})
        .then(()=>{
            setChange(!change)
        })
    }

    const handleComment = () => {
        setShowComments(!showComments)
    }

    const handleShare = () => {
        Axios.post('/api/share',{postId: props.id, userId: props.userId})
        .then(()=>{
            setChange(!change)
        })
    }
    useEffect(()=>{
        Axios.post('/api/getlikes',{id: props.id})
        .then(res=>setLikes(res.data[0].likes))

        Axios.post('/api/getcomments',{id: props.id})
        .then(res=>setComments(res.data[0].comments))

        Axios.post('/api/getshares',{id: props.id})
        .then(res=>setShares(res.data[0].shares))
    },[change])
  return (
    <div>
        <Panel>
            <div className='userinfo'>
              <img src={props.photoURL} alt=''/>
              <div>
                <h3 onClick={handleNav}>{props.displayName}</h3>
                <span>{props.email}</span>
                <span>{props.time}</span>
              </div>
            </div>
            <div className='post-text'>
                <span>{props.description}</span>
            </div>
            {
            img && 
            <div className='shared-image'>
                <img src={img} alt=''/>
            </div>
            }
            {
                img && 
                <div className='shared-image'>
                    <img src={img} alt=''/>
                </div>
                
            }
            <div className='social'>
                <div className='social-count'>
                    <div>
                        <img src='/images/like.svg' alt=''/>
                        <span>{likes}</span>
                    </div>
                    <div>
                        <span>{comments} comments</span>
                    </div>
                    <div>
                        <span>{shares} shared</span>
                    </div>
                </div>
                <div className='social-buttons'>
                    <button onClick={handleLike} className='like'>
                        <img src='/images/like.svg' alt=''/>
                        Like
                    </button>
                    <button onClick={handleComment} className='comment'>
                        <img src='/images/comment.svg' alt=''/>
                        Comment
                    </button>
                    <button onClick={handleShare} className='share'>
                        <img src='/images/share.svg' alt=''/>
                        Share
                    </button>
                </div>
                {showComments && 
                <Comment 
                    postId = {props.id}
                    userId = {props.userId}
                />}
            </div>
        </Panel>
    </div>
  )
}


const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 10px black;
padding: 30px;
margin-bottom: 20px;
.userinfo {
  display: flex;
  flex-direction: row;
  margin: 20px 0;

  div{
    display: flex;
    flex-direction: column;
    h3 {
      padding: 0;
      margin: 0;
      margin-bottom: 5px;
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
.post-text {
    margin-bottom: 20px;
}
.shared-image {
    margin-bottom: 20px;
    img {
        width: 100%;
    }
}
.social {
    display: flex;
    flex-direction: column;
    img {
        width: 15px;
    }
    .social-count, .social-buttons {
        display: inline-flex;
        width: 100%;
        margin: 5px 0px;
    }

    .social-count {
        justify-content: space-between;
    }

    .social-buttons {
        justify-content: space-around;
        button {
            width: 100%;
            padding: 10px 0;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            img {
                padding-right: 5px;
            }
            font-size: 15px;
            font-weight: 700;
            color: rgb(200,200,200);
        }
        .like {
            background-color: rgba(51,51,255,0.2);
            transition: 0.2s ease-in-out;
            &:hover {
                background-color: rgba(51,51,255,0.5);
            }
        }
        .comment {
            background-color: rgba(255,51,51,0.2);
            transition: 0.2s ease-in-out;
            &:hover {
                background-color: rgba(255,51,51,0.5);
            }
        }
        .share {
            background-color: rgba(51,255,51,0.2);
            transition: 0.2s ease-in-out;
            &:hover {
                background-color: rgba(51,255,51,0.5);
            }
        }
    }
}
`
const CommentSection = styled.div`
background-color: rgba(255,255,255,0.1);
padding: 10px;
border-radius: 10px;
.comment {
    background-color: rgb(10,10,10);
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;

    .commenter-info {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        img {
            width: 40px;
            height:40px;
            border-radius: 50%;
            margin-right: 10px;
        }
        div {
            h3 {
                margin: 0;
            }
            span {
                color: rgb(180,180,180);
                font-size: 13px;
            }
        }
    }
}
.input-comment {
    background-color: rgb(10,10,10);
    padding: 20px 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    button {
        color: rgb(230,230,230);
        font-weight: 600;
        width: 60px;
        height: 30px;
        transition: 0.2s ease-in-out;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: rgba(51,255,255,0.3);
        border-radius: 10px;
        &:hover {
            background-color: rgba(51,255,255,0.7);
        }
    }
    input {
        width: 100%;
        height: 30px;
        background-image: none;
        background-color: rgb(50,50,50);
        border: none;
        border-radius: 10px;
        color: rgb(200,200,200);
        margin-right: 10px;
        &:active {
            background-color: rgb(80,80,80);
            border: 1px rgba(51,255,255,1);
        }
    }
}
`

export default Post
