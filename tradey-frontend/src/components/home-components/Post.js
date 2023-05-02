import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Axios from 'axios'
import Comments from './post-component/Comments'
import { CommentButton, ReactButton, ShareButton } from './SocialButton'

function Post(props) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [shares, setShares] = useState([])
    const img = props.image
    const [showComments,setShowComments] = useState(false)
    const [change,setChange] = useState(false)
    const [cmtChange,setCmtChange] = useState(false)
    const [liked,setLiked] = useState(null)
    const [mostReact,setMostReact] = useState([])

    const handleNav = () => {
        navigate('/user')
    }

    const handleLike = (type) => {
        Axios.post('/api/like',{postId: props.id, userId: props.userId, type: type})
        .then(()=>{
            setChange(!change)
        })
    }

    const handleComment = () => {
        if(!showComments) {
            props.setShowingCommentInput(props.id)
            setShowComments(!showComments)
        } else {
            if(props.showingCommentInput == props.id) {
                setShowComments(!showComments)
            } else {
                props.setShowingCommentInput(props.id)
            }
        }
    }

    const handleShare = () => {
        Axios.post('/api/share',{postId: props.id, userId: props.userId})
        .then(()=>{
            setChange(!change)
        })
    }

    useEffect(()=>{
        Axios.post('/api/getcomments',{id: props.id})
        .then(res=>{
            setComments(res.data)
        })
    },[cmtChange])

    useEffect(()=>{
        Axios.post('/api/getlikes',{id: props.id})
        .then(res=>{
            setLikes(res.data)
            setLiked(null)
            var reacts = [
                {react: 'like',quant: 0},
                {react: 'love',quant: 0},
                {react: 'wow',quant: 0},
                {react: 'sad',quant: 0},
                {react: 'angry',quant: 0}
            ]
            for(var i = 0; i < res.data.length; i++) {
                if(res.data[i].liker_id == props.userId) {
                    setLiked(res.data[i])
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


        Axios.post('/api/getshares',{id: props.id})
        .then(res=>setShares(res.data))
    },[change])
  return (
    <div>
        <Panel className='user-post'>
            <div className='userinfo'>
              <img className='user-image' src={props.photoURL} alt=''/>
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
            {/* {
                img && 
                <div className='shared-image'>
                    <img src={img} alt=''/>
                </div>
                
            } */}
            <div className='social'>
                <div className='social-buttons'>
                    <ReactButton
                        handleLike = {handleLike}
                        liked = {liked}
                        likes = {likes}
                        mostReact = {mostReact}
                    />
                    <CommentButton
                        handleComment = {handleComment}
                        comments = {comments}
                        openning = {showComments}
                        text = 'Comment'
                    />
                    <ShareButton
                        handleShare = {handleShare}
                        shares = {shares}
                    />
                </div>
                {showComments && 
                <Comments
                    postId = {props.id}
                    userId = {props.userId}
                    comments = {comments}
                    change = {cmtChange}
                    setChange = {setCmtChange}
                    showingCommentInput = {props.showingCommentInput}
                    setShowingCommentInput = {props.setShowingCommentInput} 
                />}
            </div>
        </Panel>
    </div>
  )
}


const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 20px rgba(0,0,0,0.6);
padding: 30px;
margin-bottom: 20px;
.userinfo {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;

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
        height: 500px;
        object-fit: cover;
        border-radius: 10px;
    }
}
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
        justify-content: space-around;
    }
}
`


export default Post
