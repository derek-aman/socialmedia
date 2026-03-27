import mongoose from "mongoose";

const messageSchema = new  mongoose.Schema({
    senderId: {
            type: mongoose.Schema.Types.ObjectId,
                ref: "User"
    },
    recieverId:{
            type: mongoose.Schema.Types.ObjectId,
                ref: "User"
    },
    message: {
       type: String
    },
    image: {
        type: String
    },
    seen: Boolean,
},{timestamps : true})

const Message = mongoose.model("Message", messageSchema);
export default Message;