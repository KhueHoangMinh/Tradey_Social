import React,{useState,useEffect} from 'react'
import Axios from 'axios'
import styled from 'styled-components'
import Comments from './Comments.js'
import { ReactButton,CommentButton } from '../SocialButton.js'

function Comment(props) {
    const [cmtLikes,setCmtLikes] = useState([])
    const [cmtLiked,setCmtLiked] = useState(null)
    const [mostReact,setMostReact] = useState([])
    const [change,setChange] = useState(false)
    const [cmtChange,setCmtChange] = useState(false)
    const [showCmtComments,setShowCmtComments] = useState(false)
    const [commentId,setcommentId] = useState()

    const [cmtContent, setCmtContent] = useState()

    useEffect(()=>{
        if(props.comment.comment_id != commentId) {
            Axios.post('/api/getcommentbycommentid',{commentId: props.comment.comment_id})
            .then(res=>setCmtContent(res.data[0]))
        }
    },[props.comment.comment_id])
    
    useEffect(()=>{
        Axios.post('/api/getlikes',{id: props.comment.comment_id})
        .then(res=>{
            setCmtLikes(res.data)
            setCmtLiked(null)
            var reacts = [
                {react: 'like',quant: 0},
                {react: 'love',quant: 0},
                {react: 'wow',quant: 0},
                {react: 'sad',quant: 0},
                {react: 'angry',quant: 0}
            ]
            for(var i = 0; i < res.data.length; i++) {
                if(cmtContent && res.data[i].liker_id == cmtContent.user_id) {
                    setCmtLiked(res.data[i])
                }
                switch(res.data[i].type) {
                    case 'like':
                        reacts[0].quant++
                        break
                    case 'love':
                        reacts[1].quant++
                        break
                    case 'wow':
                        reacts[2].quant++
                        break
                    case 'sad':
                        reacts[3].quant++
                        break
                    case 'angry':
                        reacts[4].quant++
                        break
                }
            }
            reacts.sort((a, b) => (a.quant > b.quant) ? -1: 1)
            setMostReact(reacts.slice(0,3))
        })

    },[change, cmtContent])

    const handleCmtLike = (type) => {
        Axios.post('/api/like',{postId: props.comment.comment_id, userId: cmtContent.user_id, type: type})
        .then(()=>{
            setChange(!change)
        })
    }

    const handleShowCmtComment = () => {
        if(!showCmtComments) {
            props.setShowingCommentInput(props.comment.comment_id)
            setShowCmtComments(!showCmtComments)
        } else {
            if(props.showingCommentInput == props.comment.comment_id) {
                setShowCmtComments(!showCmtComments)
            } else {
                props.setShowingCommentInput(props.comment.comment_id)
            }
        }
    }

    return (
        <>
        {
            cmtContent ? (
        <CommentStyle className='user-post'>
            <div className='user-comment'> 
                        <div className='commenter-info'>
                            <img className='user-image' src={cmtContent && cmtContent.photourl} alt=''/>
                            <div>
                                <h3>{cmtContent && cmtContent.name}</h3>
                                <span>{cmtContent && cmtContent.time}</span>
                            </div>
                        </div>
                        <div className='comment-content'>
                            <p>{cmtContent && cmtContent.content}</p>
                        </div><div className='social'>
                            <div className='social-buttons'>
                                <ReactButton
                                    handleLike = {handleCmtLike}
                                    liked = {cmtLiked}
                                    likes = {cmtLikes}
                                    mostReact = {mostReact}
                                />
                                <CommentButton
                                    handleComment = {handleShowCmtComment}
                                    comments = {props.comment.comments}
                                    openning = {showCmtComments}
                                    text = 'reply'
                                />
                            </div>
                            {showCmtComments && 
                            <Comments
                                postId = {props.comment.comment_id}
                                userId = {cmtContent.user_id}
                                comments = {props.comment.comments}
                                change = {props.change}
                                setChange = {props.setChange}
                                showingCommentInput = {props.showingCommentInput}
                                setShowingCommentInput = {props.setShowingCommentInput} 
                            />}
                        </div>
            </div>
        </CommentStyle>
        ) : ''
    }
        </>
    )
}

const CommentStyle = styled.div`

.user-comment {
    background-color: rgba(255,255,255,0.02);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 10px;
    .social {
        display: flex;
        flex-direction: column;
        img {
            height: 15px;
            width: 15px;
            object-fit: cover;
        }
        .social-buttons {
            display: inline-flex;
            width: 100%;
            margin: 5px 0px;
        }

        .social-buttons {
            justify-content: space-around;
        }
    }

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
`

export default Comment