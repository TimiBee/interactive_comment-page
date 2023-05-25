import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FaReply } from 'react-icons/fa';
import {MdDelete} from 'react-icons/md'
import {MdOutlineEdit} from 'react-icons/md'
import { useGlobalContext } from './Context';
import { useGlobalEffect } from './useGlobalEffect';
import { useToggle} from './useToggle'
import Replies from './Replies';
import { v4 as uuidv4 } from 'uuid';

const Comments = ({commentData}) => {
const { id: commentId , content, createdAt, score, user, replies} = commentData;
const { username, image } = user;
const { state, toggleCommentScore, handleNewReplySubmit, handleCommentEdit, openModalForCommentDelete } = useGlobalContext()
const [showReply, setShowReply] = useState(false);
const [newContent, setNewContent] = useState('');
const [isEditing, setIsEditing] = useState(false);

const { canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown } = useToggle();
const { invalid, setInvalid } = useGlobalEffect();

const startEdit = () => {
  setShowReply(true);
  setIsEditing(true);
}

const setToDefault = () => {
  setNewContent('')
  setShowReply(false)
  setIsEditing(false);
}
const generateNewId = uuidv4();

  return <article className='comment'>

   <section>
   <header className='comment_header'>
     <img src={image.png} alt={`${username} 'img'`}/>
     <h1>{username}{user.username === state.currentUser.username && <span> you </span>}</h1>
     <p>{createdAt}</p>
   </header>

   <p>{content}</p>

  {/*beginning of toggle  */}
  <div className='toggle'>

  <div>
    <button onClick={() => toggleCommentScore(commentId, 'inc', canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown)} >
      <AiOutlinePlus />
    </button>
 </div>  

   <p>{score}</p>
  
  <div>
    <button onClick={() => toggleCommentScore(commentId, 'dec', canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown)} >
      <AiOutlineMinus />
    </button>
  </div>
</div> 
{/* end of toggle */}


   {  ( user.username !== state.currentUser.username ) ? <div className='reply_container'>
    <button onClick={() => setShowReply(true)} className='btn_open_reply'>
         <FaReply/>
         <span>
           Reply
         </span>
    </button>
     </div> : <div className='reply_container'>

    <div className='userBtn_container'>
    <button onClick={() => openModalForCommentDelete(commentId, 'comment')} className='btn_danger'>
      <MdDelete className='icon'/>
      Delete
    </button>

    <button onClick={() => handleCommentEdit(commentId,
      startEdit, 
      setNewContent)} className="btn_primary">
       <MdOutlineEdit className='icon'/>
      Edit
    </button>
    </div>
  </div>     
  // should have made these as componentes but for clarity, if username of user is === state.username return only the edit and delete btns else return reply btn
  }  
  </section>

  { showReply &&  
   <form onSubmit={handleNewReplySubmit(commentId, 
    newContent, 
    setToDefault, 
    generateNewId, 
    isEditing,
    setInvalid
  )} className='form_field'>

    <div className='img-container'>
      <img src={state.currentUser.image.png} width='35' height='35' alt={state.currentUser.username}/>
    </div>

    <div className='textarea_container'>
    <textarea name='reply' value={newContent} onChange={(e) => setNewContent(e.target.value)} className={`${invalid && 'invalid'}`} placeholder='Add a reply...'>
    </textarea>
    </div>

     <div className='submit_container'>
       <button type='submit'>{isEditing ? 'Update' : 'Reply' }</button>
     </div>
   </form> }

<section className='container_for_replies'>
   { 
    replies.length > 0 ? replies.map(singleReply => { 
    const newReply = {...singleReply}
    return <Replies key = {singleReply.id} reply={newReply} commentId={commentId} />}) :  <p className='no_reply'>No replies yet</p>  
  }
</section>
  </article> 
};

export default Comments;
