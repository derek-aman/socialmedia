import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId
    const recieverId = req.params.recieverId
    const {message} = req.body

    let image;
    if(req.file){
        image = await uploadOnCloudinary(req.file.path);
    }
    // message created
    const newMessage = await Message.create({
        sender:senderId,
        receiver:recieverId,
        message:message,
        image,
    })

    // we will check before messssage was there or not

    let conversation = await Conversation.findOne({
        participants: {$all:[senderId, recieverId]}
    });

    if(!conversation){
        conversation = await Conversation.create({
            participants:[senderId, recieverId],
            messages:[newMessage._id]
        })
    }else{
        conversation.messages.push(newMessage._id)
        await conversation.save()
    }
    return res.status(200).json(newMessage)
    } catch (error) {
      console.error(error);
        return res.status(500).json({
        message: "Internal Server Error",
        });  
    }


}

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    return res.status(200).json(conversation);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getPrevUserChat = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currentUserId
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const userMap = {};

    conversations.forEach(conv => {
      conv.participants.forEach(user => {
        if (user._id.toString() !== currentUserId.toString()) {
          userMap[user._id] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);

    return res.status(200).json(previousUsers);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};