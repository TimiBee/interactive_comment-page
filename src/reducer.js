
const reducer = (state, action) => {
  //action is an object that contains type and payload

  if (action.type === 'HANDLE_COMMENT_EDIT'){ //edit user's comment
    action.payload.startEdit();
    let specificComment = state.comments.find(comment => comment.id === action.payload.commentId);
    action.payload.setNewContent(specificComment.content);
    return state;
  }

  //handle user's edit and when submitting a new reply
  if (action.type === 'HANDLE_REPLY_SUBMIT'){ 
      action.payload.e.preventDefault();//prevent default

      if (!action.payload.content) {
       action.payload.setInvalid(true);
       return state;
      }

      if (action.payload.content && action.payload.isEditing) { //if isEditing is true
        const editedComment = state.comments.map(comment => {// loop through the comment, if comment's id === editID that was clicked, return the comment with the edited content
          if(comment.id === action.payload.id) return {...comment, content:action.payload.content}
          return comment
      })

        action.payload.setToDefault()
        return {...state, comments: editedComment}
      }

      // if user is submiting a new reply
      const today = new Date();
      const createdAt = today.getDate() +'/' + (today.getMonth() + 1 ) + '/' + today.getFullYear()
      const newReply =  {
          id: action.payload.newId,
          content: action.payload.content,
          createdAt,
          score: 0,
          replyingTo: '',
          user: {
            image: { 
              png: state.currentUser.image.png,
              webp: state.currentUser.image.webp
            },
            username: state.currentUser.username,
          }
        };

      const addNewReply = state.comments.map(comment => {
        const {replies, user} = comment;
        if (comment.id === action.payload.id){ 

          const modifiedReply = {...newReply, replyingTo:user.username}
          replies.unshift(modifiedReply);
        }     
          return comment;
      })
      action.payload.setToDefault()
      return {...state, comments:addNewReply}
  }

  if(action.type === 'HANDLE_REPLY_EDIT'){ // initialize edit for the user

     action.payload.initializeEdit();
     const specificComment = state.comments.find(comment => comment.id === action.payload.commentId)
     const specificReply = specificComment.replies.find(reply => reply.id === action.payload.id);
     action.payload.setNewContent(specificReply.content)
     return state;  
  }
  //to create new Comment
  if (action.type === 'HANDLE_COMMENT_SUBMIT' ) {

      action.payload.e.preventDefault();
      if(!action.payload.content){
        action.payload.setInvalid(true);
        return state
      }
      const today = new Date();
      const createdAt = today.getDate() +'/' + (today.getMonth() + 1 ) + '/' + today.getFullYear()
      const newComment = {
      id: action.payload.id,
      content: action.payload.content,
      createdAt,
      score: 0,
      user: {
        image: { 
          png: state.currentUser.image.png,
          webp: state.currentUser.image.webp
        },
        username: state.currentUser.username
      },
      replies: [] 
      }
      
      const addNewComment = [...state.comments, newComment]
      action.payload.setToEmptyString(); 
      return {...state, comments: addNewComment}
  }

// increment comment scores
  if (action.type === 'TOGGLE_COMMENT'){

        const tempComments = state.comments.map(comment => {
           if(comment.id === action.payload.id) {  
           
           if(action.payload.type === 'inc') { 

             while (action.payload.canToggleUp) {
               action.payload.setCanToggleUp(false);
               action.payload.setCanToggleDown(true)
               return {...comment, score: comment.score + 1} 
             }        
           }

           if(action.payload.type === 'dec') {      
             while (comment.score > 0 && action.payload.canToggleDown) { 
               action.payload.setCanToggleDown(false);
               action.payload.setCanToggleUp(true);      
            return {...comment, score: comment.score - 1} 
             } 
           }
       }
       return comment;
   })
     
      const newState = {...state, comments:tempComments}; 
      return newState;
  }

 // increment reply scores
  if (action.type === 'TOGGLE_REPLY'){
    const tempComments = state.comments.map(comment => {
      const {replies} = comment // destructure replies
      const modifiedReply = replies.map( reply => {
         if (reply.id === action.payload.id){

           if (action.payload.type === 'inc'){
             
             while(action.payload.canToggleUp){
               action.payload.setCanToggleUp(false);
               action.payload.setCanToggleDown(true)
               return {...reply, score: reply.score + 1}
             }        
           }

           if (action.payload.type === 'dec') {
             while (reply.score > 0 && action.payload.canToggleDown) {
               action.payload.setCanToggleDown(false);
               action.payload.setCanToggleUp(true);  
               return {...reply, score: reply.score - 1}
             }           
           }
         }
         return reply;
      })
      return {...comment, replies: modifiedReply}
    })
    return {...state, comments: tempComments}
  }

  if (action.type === 'HANDLE_REPLY_TO_REPLY'){

    action.payload.e.preventDefault();

    // if (!action.payload.content) { 
    //  action.payload.setInvalid(true);
    //  return state;
    // }
    
    if(action.payload.content && action.payload.isEditing){
      const newComment = state.comments.map(comment => {
        if(comment.id === action.payload.commentId){
          const {replies} = comment;
          const editedReply = replies.map(reply => {
            if(reply.id === action.payload.replyId) return {...reply, content: action.payload.content}
            return reply
          })
          return { ...comment, replies: editedReply }
        }
        return comment
      })
      action.payload.toDefault()
      return {...state, comments: newComment}
    }

    const newComment = state.comments.map(comment => { // loop through the comment to se which of the comment's id matches that which was clicked

      if (comment.id === action.payload.commentId){ //if it matches, destructure the replies and loop through it and find reply that matches id
        const {replies} = comment;

        const addReply = replies.map(reply => {
          if (reply.id === action.payload.replyId) {
          const {user} = reply //destructure user from the reply so we can use the user.username in the newReply
          const today = new Date();
          const createdAt = today.getDate() +'/' + (today.getMonth() + 1 ) + '/' + today.getFullYear()
          const newReply = { // create new reply
          id: action.payload.newId,
          content: action.payload.content,
          createdAt,
          score: 0,
          replyingTo: user.username,
          user: {
            image: { 
              png: state.currentUser.image.png,
              webp:state.currentUser.image.webp
            },
          username: state.currentUser.username
          }
        } 
         return [reply, newReply] //this returns an array of the reply and the newReply    
          }
         return reply
        }) 
        const flattenAddReply = addReply.flat() //remove inner arrays from addReply
        return { ...comment, replies: flattenAddReply }
      }
      return comment
    })
    action.payload.toDefault();
    return {...state, comments: newComment}
  }

  if (action.type === 'HANDLE_COMMENT_DELETE') {
    const filteredComments = state.comments.filter(comment => comment.id !== action.payload.id);
    action.payload.setIsModalOpen(false);
    return {...state, comments: filteredComments}
  }

 // for user to delete replies
  if (action.type === 'HANDLE_REPLY_DELETE') {
    const newComment = state.comments.map(comment => {
      if(comment.id === action.payload.commentId){
        const {replies} = comment
        const filteredReply = replies.filter(reply => reply.id !== action.payload.replyId)
        return {...comment, replies: filteredReply}
      }
      return comment;
    })
    action.payload.setIsModalOpen(false);
    return {...state, comments: newComment}
  }
  
  throw new Error( 'no matching type')
}

export default reducer