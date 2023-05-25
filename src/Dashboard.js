import React, {useState} from 'react';
import Comments from './Comments';
import { useGlobalContext } from './Context';
import {v4 as uuid4} from 'uuid';
import {useGlobalEffect } from './useGlobalEffect'
const Dashboard = () => {
   const {state, handleNewCommentSubmit} = useGlobalContext();
   const [content, setContent] = useState('')
   const setContentToEmptyString = () => setContent('');
   const newCommentId = uuid4();

  const { invalid, setInvalid } = useGlobalEffect();
  return <main>
  { 
  state.comments.map(comment => {
 
  return (
    <Comments key={comment.id} commentData = {{...comment}}/>
  )
  })}   

  <footer>  
    <form onSubmit={handleNewCommentSubmit( newCommentId, content, setContentToEmptyString, setInvalid)} className='form_field comment'>
      <div className='img_container'>
     <img src={state.currentUser.image.png} alt={state.currentUser.username}/>
     </div>

     <div className='textarea_container'>
    <textarea name='newCommentContent' value={content} onChange={(e) => setContent(e.target.value)} className={`${invalid && 'invalid'}`}>
    </textarea>
     </div>

  <div className='submit_container'>
    <button type='submit'>
      send
    </button>
  </div>
   
    </form>
</footer>
  </main>;
};

export default Dashboard;
