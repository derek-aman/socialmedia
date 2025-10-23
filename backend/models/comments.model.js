import mongoose from "mongoose";


const CommentsSchems = new mongoose.Schema({
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    body : {
        type: String,
        required : true
    },
    postId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }      
            
});

const Comment = mongoose.model("Comment", CommentsSchems);
export default Comment;