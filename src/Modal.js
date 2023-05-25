import React from 'react';
import { useGlobalContext } from './Context';


const Modal = () => {
  const { isModalOpen, handleCommentDelete, handleReplyDelete, deleteCommentID, setIsModalOpen, deleteType, deleteReplyID } = useGlobalContext();

  const controlDeleteType = () => deleteType === 'comment' ? handleCommentDelete(deleteCommentID) : handleReplyDelete(deleteCommentID, deleteReplyID); 
  return (
    <div className={`${isModalOpen ? 'modal-overlay show-modal': 'modal-overlay'}`}>
        <div className='modal-container'>
         <h1>Delete Comment</h1>
        <p>
         Are you sure you want to delete this comment? This will remove the comment and can't be undone
        </p>
        <footer>
            <div>
            <button className='dont_delete' onClick={() => setIsModalOpen(false)}>
            No, Cancel
            </button>
            </div>
            <div>          
            <button className='delete' onClick={controlDeleteType}>
            Yes, Delete
            </button>
            </div>
        </footer>
        </div>
    </div>
  )
}

export default Modal