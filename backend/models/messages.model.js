import mongoose from "mongoose";

const messageSchema = new  mongoose.Schema({
    _id : objectId,
    senderId: objectId,
    recieverId: objectId,
    content: String,
    createdAt: Date,
    seen: Boolean,
})