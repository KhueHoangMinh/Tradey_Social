import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import styled from 'styled-components'
import Comment from './Comment.js'
import CommentInput from '../CommentInput.js'

function Comments(props) {
    const [userComment,setUserComment] = useState()
    const [loading,setLoading] = useState(1)


    const handleComment = (e) => {
        e.preventDefault()
        setLoading(0)
        Axios.post('/api/posts/comment', {postId: props.postId, userId: props.userId, content: userComment})
        .then(res=>{
            props.setChange(!props.change)
            setUserComment('')
            setLoading(1)
        })
    }

    return (
        <CommentSection>
            <CommentInput
                commentFor = {props.postId}
                comment = {userComment}
                setComment = {setUserComment}
                handleComment = {handleComment}
                showingCommentInput = {props.showingCommentInput}
                loading = {loading}
                text = 'Write a comment...'
                buttonText = 'Post'
            />
            {props.comments && props.comments.map(comment=>(
                <Comment
                    postId = {props.postId}
                    userId = {props.userId}
                    comment = {comment}
                    change = {props.change}
                    setChange = {props.setChange}
                    showingCommentInput = {props.showingCommentInput}
                    setShowingCommentInput = {props.setShowingCommentInput} 
                />
            ))}
        </CommentSection>
    )
}

const CommentSection = styled.div`
border-radius: 10px;
margin-top: 20px;
`

export default Comments