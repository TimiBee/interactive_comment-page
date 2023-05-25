import React,{ useState, useContext, useEffect, useReducer} from 'react'
import data from './data.json';
import reducer from './reducer';
import {v4 as uuid4 } from 'uuid';


const AppContext = React.createContext();// call the context api

 const fetchFromLocalStorage = () => JSON.parse(localStorage.getItem('state'))

const Context = ({children}) => {

const [isModalOpen, setIsModalOpen] = useState(false); //open modal for delete 
const [deleteCommentID, setDeleteCommentID] = useState(null); //to get id if the comment that wants to be deleted by the user
const [deleteReplyID, setDeleteReplyID] = useState(null); //to get the id of the reply that wants to be deleted by the user
const [deleteType, setDeleteType] = useState(''); //set the type that should be deleted, whether it's comment or reply 


const openModalForCommentDelete = (id, type) => {
   setDeleteType(type)
   setIsModalOpen(true);
   setDeleteCommentID(id);   
} // to delete comment

const openModalForReplyDelete = (commentId, id, type) => {
  setDeleteType(type);
  setIsModalOpen(true);
  setDeleteCommentID(commentId)
  setDeleteReplyID(id);
} // to delete reply

const modifyComment = data.comments.map(comment => {
  const today = new Date();
  const createdAt = today.getDate() + '/' + (today.getMonth() + 1 ) + '/' + today.getFullYear();

  const commentsId = uuid4();
  const {replies} = comment;
    const modifiedReply = replies.map(reply => { 
    const today = new Date();
    const createdAt = today.getDate() +'/' + (today.getMonth() + 1 ) + '/' + today.getFullYear()
    const id = uuid4()
    return  {...reply, id, createdAt}
   })

  return {...comment, id:commentsId, replies:modifiedReply, createdAt }
});//this changes the id, timestamps of the comment and replies

const initialState = fetchFromLocalStorage() ? fetchFromLocalStorage() : {...data, comments:modifyComment}; //update the comment with modifiedComment variable

const [state, dispatch] = useReducer(reducer, initialState);

useEffect(() => {
    const sortedComments = state.comments.sort((a, b) => b.score - a.score);
    const newState = {...state, comments:sortedComments}; 
    localStorage.setItem('state',JSON.stringify(newState))
  },[state]); //the useEffect here, sorts the comment array in decreasing order. The comment with the highest upvote should be at the top. ** NOTE TO SELF ** There's been a malfunction or drawback to this, as useEffects sorts the comments array after the program fetches from the localStorage.  
    
const toggleCommentScore = (id, type, canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown) => dispatch({type:'TOGGLE_COMMENT', payload:{id, type, canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown}});

const toggleReplyScore = (id, type, canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown) => (dispatch({type: 'TOGGLE_REPLY' , payload:{id, type, canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown}}));

const handleNewReplySubmit = (id, content, setToDefault, newId, isEditing, setInvalid) => {
   return function(e){
     return dispatch({type: 'HANDLE_REPLY_SUBMIT', payload:{ e, id, content, setToDefault, newId, isEditing, setInvalid }});
}
} // used closures here and I'm proud 

const handleNewCommentSubmit = (id, content, setToEmptyString, setInvalid) => {
   return function(e){
     return dispatch({type: 'HANDLE_COMMENT_SUBMIT', payload:{e, id, content, setToEmptyString, setInvalid}});
  }
} // closures here too
const handleReplyToReply = (commentId, replyId, content, newId, toDefault, isEditing, setInvalid) => {

    return function(e) {
        return dispatch({type: 'HANDLE_REPLY_TO_REPLY', payload: {e, commentId, replyId, content, newId, toDefault, isEditing}});
   }
 }

const handleCommentDelete = (id) => dispatch({type: 'HANDLE_COMMENT_DELETE', payload:{id, setIsModalOpen}})


const handleReplyDelete = (commentId, replyId) => dispatch({type: 'HANDLE_REPLY_DELETE', payload:{commentId, replyId, setIsModalOpen}});

const handleCommentEdit = (commentId, startEdit, setNewContent) => dispatch({type: 'HANDLE_COMMENT_EDIT', payload:{commentId, startEdit, setNewContent}})

const handleReplyEdit = (commentId, id, initializeEdit, setNewContent) => dispatch({type: 'HANDLE_REPLY_EDIT', payload:{commentId, id, initializeEdit, setNewContent}})

//this is a fucking API lol
  return (
    <AppContext.Provider value={{ 
    toggleCommentScore, 
    toggleReplyScore, 
    state, 
    handleNewReplySubmit, 
    handleNewCommentSubmit, 
    handleReplyToReply, 
    handleCommentDelete, 
    handleReplyDelete, 
    handleCommentEdit,
    handleReplyEdit,
    openModalForCommentDelete,
    openModalForReplyDelete,
    isModalOpen,
    setIsModalOpen,
    deleteCommentID,
    deleteType,
    deleteReplyID,   
    }}>
        {children}
    </AppContext.Provider>
  )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}
export default Context;