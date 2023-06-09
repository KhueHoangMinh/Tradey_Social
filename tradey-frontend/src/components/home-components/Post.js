import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Axios from 'axios'
import Comments from './post-component/Comments'
import ShareBox from './post-component/ShareBox'
import { CommentButton, ReactButton, ShareButton } from './SocialButton'
import CommentInput from './CommentInput'
import Loading from '../Loading.js'
import Item from '../market-component/Item'

function Post(props) {
    const navigate = useNavigate()
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [shares, setShares] = useState(0)
    const [showComments,setShowComments] = useState(false)
    const [change,setChange] = useState(false)
    const [cmtChange,setCmtChange] = useState(false)
    const [liked,setLiked] = useState(null)
    const [mostReact,setMostReact] = useState([])
    const [postContent,setPostContent] = useState([])
    const [product,setProduct] = useState()
    const [loading,setLoading] = useState(1)

    useEffect(()=>{
        if(props.contentType !== 'shared') {
            setLoading(0)
            Axios.post('api/posts/getpostbypostid', {postId: props.id})
            .then(res=>{
                setPostContent(res.data)
                if(res.data.type === 'shareproduct') {
                    Axios.post('api/market/getproductbyid', {productId: res.data.content[0].source, addPublisher: true})
                    .then(res2=>{
                        setProduct(res2.data[0])
                    })
                }
                setLoading(1)
            })
        }
        if(props.type === 'shareproduct') {
            setLoading(0)
            Axios.post('api/market/getproductbyid', {productId: props.content[0].source, addPublisher: true})
            .then(res2=>{
                setProduct(res2.data[0])
                setLoading(1)
            })
        }
    },[])

    const handleNav = () => {
        navigate('/user')
    }

    const handleLike = (type) => {
        Axios.post('api/posts/like',{postId: props.id, userId: props.userId, type: type})
        .then(()=>{
            setChange(!change)
        })
    }

    const handleComment = () => {
        if(!showComments) {
            props.setShowingCommentInput(props.id)
            props.setShowingShareInput(null)
            setShowComments(!showComments)
        } else {
            if(props.showingCommentInput === props.id) {
                setShowComments(!showComments)
            } else {
                props.setShowingCommentInput(props.id)
                props.setShowingShareInput(null)
            }
        }
    }

    const handleShare = () => {
        setShowComments(false)
        if(props.showingShareInput === props.id) {
            props.setShowingShareInput(null)
        } else {
            props.setShowingShareInput(props.id)
        }
    }

    useEffect(()=>{
        if(props.contentType !== 'shared') {
            Axios.post('api/posts/getcomments',{id: props.id})
            .then(res=>{
                setComments(res.data)
            })
        }
    },[cmtChange])

    useEffect(()=>{
        if(props.contentType !== 'shared') {
            Axios.post('api/posts/getlikes',{id: props.id})
            .then(res=>{
                setLikes(res.data)
                setLiked(null)
                var reacts = [
                    {react: 'like',quant: 0},
                    {react: 'love',quant: 0},
                    {react: 'haha',quant: 0},
                    {react: 'wow',quant: 0},
                    {react: 'sad',quant: 0},
                    {react: 'angry',quant: 0}
                ]
                for(var i = 0; i < res.data.length; i++) {
                    if(res.data[i].liker_id === props.userId) {
                        setLiked(res.data[i])
                    }
                    switch(res.data[i].type) {
                        case 'like':
                            reacts[0].quant++
                            break
                        case 'love':
                            reacts[1].quant++
                            break
                        case 'haha':
                            reacts[2].quant++
                            break
                        case 'wow':
                            reacts[3].quant++
                            break
                        case 'sad':
                            reacts[4].quant++
                            break
                        case 'angry':
                            reacts[5].quant++
                            break
                    }
                }
                reacts.sort((a, b) => (a.quant > b.quant) ? -1: 1)
                setMostReact(reacts.slice(0,3))
            })
    
    
            Axios.post('api/posts/getshares',{id: props.id})
            .then(res=>{
                setShares(res.data.shares)
            })
        }
    },[change])
    const viewUserPage = (userId) => {
        navigate('/about',{state: {
            userId: userId
        }})
    }

  return (
    <Panel className='user-post'>
        {
            loading === 1 ? (
                <>
                    <div className='userinfo'>
                      <img className='user-image' crossOrigin='use-credentials' src={props.contentType !== 'shared' ? (postContent && (postContent.photourl ? window.host + postContent.photourl : '/images/user.png')) : (props.photoURL ? (window.host + props.photoURL) : '/images/user.png')} alt=''/>
                      <div>
                        <h3 onClick={()=>{
                            if(props.contentType != 'shared') {
                                viewUserPage(postContent && postContent.publisher_id)
                            } else {
                                viewUserPage(props.publisher_id)
                            }
                            }}>{props.contentType !== 'shared' ? (postContent && postContent.name) : props.displayName}</h3>
                        <span>{props.contentType !== 'shared' ? (postContent && postContent.email) : props.email}</span>
                        <span>{props.contentType !== 'shared' ? (postContent && postContent.time) : props.time}</span>
                      </div>
                    </div>
                    <div className='post-text'>
                        <span>{props.contentType !== 'shared' ? (postContent && postContent.description) : props.description}</span>
                    </div>
        
                    
                    {
                        (postContent && postContent.type === 'share') || props.type === 'share' ? (
                            <div className='content'>
                                {
                                    props.contentType !== 'shared' ? (postContent &&  postContent.sharedContent && <Post
                                        userId = {props.user_id}
                                        id = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.post_id) : props.sharedContent.post_id}
                                        displayName = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.name) : props.sharedContent.name}
                                        email = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.email) : props.sharedContent.email}
                                        photoURL = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.photourl) : props.sharedContent.photourl}
                                        time = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.time) : props.sharedContent.time}
                                        publisher_id = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.publisher_id) : props.sharedContent.publisher_id}
                                        description = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.description) : props.sharedContent.description}
                                        content = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.content) : props.sharedContent.content}
                                        type = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.type) : props.sharedContent.type}
                                        sharedContent = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.sharedContent) : (props.sharedContent.sharedContent)}
                                        showingCommentInput = {props.showingCommentInput}
                                        setShowingCommentInput = {props.setShowingCommentInput}
                                        contentType = 'shared'
                                    />) : (props.sharedContent && <Post
                                        userId = {props.user_id}
                                        id = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.post_id) : props.sharedContent.post_id}
                                        displayName = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.name) : props.sharedContent.name}
                                        email = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.email) : props.sharedContent.email}
                                        photoURL = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.photourl) : props.sharedContent.photourl}
                                        time = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.time) : props.sharedContent.time}
                                        publisher_id = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.publisher_id) : props.sharedContent.publisher_id}
                                        description = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.description) : props.sharedContent.description}
                                        content = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.content) : props.sharedContent.content}
                                        type = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.type) : props.sharedContent.type}
                                        sharedContent = {props.contentType !== 'shared' ? (postContent && postContent.sharedContent.sharedContent) : (props.sharedContent.sharedContent)}
                                        showingCommentInput = {props.showingCommentInput}
                                        setShowingCommentInput = {props.setShowingCommentInput}
                                        contentType = 'shared'
                                    />)
                                }
                            </div>
                        ) : ((postContent && postContent.type === 'shareproduct') || props.type === 'shareproduct' ?
                            (product &&
                                <div className='content'>
                                    <Item
                                        userId = {props.userId}
                                        sellerId = {product.user_id}
                                        userPhotoURL = {product.photourl}
                                        userDisplayName = {product.name}
                                        userEmail = {product.email}
                                        productTime = {product.time}
                                        productId={product.product_id}
                                        name={product.product_name}
                                        description={product.description}
                                        image={product.image}
                                        price={product.price}
                                        type={product.type}
                                    />
                                </div>
                            ) : (
                                <div className='content'>
                                    {   
                                        props.contentType !== 'shared' ?
                                        (postContent && (postContent.content && postContent.content.map((content) => (
                                            <img className='posted-image' src={window.host + content.link} alt=''/>
                                        )))) : 
                                        (props.content.map((content) => (
                                            <img className='posted-image' src={window.host + content.link} alt=''/>
                                        ))) 
                                    }
                                </div>
                            )
                        )
                    }
                    {
                        postContent && props.contentType !== 'shared' &&
                        <>
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
                                        openning = {props.showingShareInput === props.id ? true : false}
                                    />
                                </div>
                                {
                                    props.showingShareInput === props.id &&
                                        <ShareBox
                                            postId = {props.id}
                                            userId = {props.userId}
                                            showingCommentInput = {props.showingShareInput}
                                            setShowingCommentInput = {props.setShowingShareInput} 
                                            type = 'share'
                                        />
                                }
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
                        </>
                    }
                </>
            ) : <Loading></Loading>
        }
    </Panel>
  )
}

const Panel = styled.div`
background-color: rgb(10,10,10);
border-radius: 10px;
box-shadow: 5px 5px 5px rgba(0,0,0,0.4);
padding: 30px;
margin-bottom: 20px;
width: calc(100% - 60px);
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
    color: rgba(255,255,255,0.9);
    transition: 0.2s ease-in-out;
    &:hover {
        cursor: pointer;
    color: rgba(255,255,255,1);
    }
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
.content {
width: 100%;
padding: 20px;
margin-left:-20px;
border-radius: 10px;
overflow:hidden;
position: relative;
.posted-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 10px;
}
}
.social {
display: flex;
flex-direction: column;
margin-top: 20px;
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
/* @media (max-width: 1200px) {
    width: calc(100vw - 100px);
} */
`


export default Post
