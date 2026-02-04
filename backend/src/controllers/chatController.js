import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// CREATE / GET CONVERSATION
export const accessConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let convo = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [req.user._id, userId],
      });
    }

    res.json(convo);
  } catch (error) {
    next(error);
  }
};

// SEND MESSAGE
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      content,
      conversation: conversationId,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// GET MESSAGES
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation: req.params.id,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
