import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// FETCH CHATS
export const fetchChats = async (req, res, next) => {
  try {
    const chats = await Conversation.find({
      participants: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const fullChats = await Conversation.populate(chats, {
      path: "lastMessage.sender",
      select: "name email",
    });

    res.json(fullChats);
  } catch (error) {
    next(error);
  }
};

// ACCESS GLOBAL CHAT
export const accessGlobalChat = async (req, res, next) => {
  try {
    let globalChat = await Conversation.findOne({ isGlobal: true })
      .populate("participants", "-password")
      .populate("lastMessage");

    if (!globalChat) {
      globalChat = await Conversation.create({
        isGlobal: true,
        participants: [], // Can be empty or include all, but for public chat maybe relevant logic isn't participant-based
      });
    }

    // Populate last message sender if exists
    if (globalChat.lastMessage) {
      await globalChat.populate({
        path: "lastMessage.sender",
        select: "name email",
      });
    }

    res.json(globalChat);
  } catch (error) {
    next(error);
  }
};

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

    await convo.populate("participants", "-password");

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

    await message.populate("sender", "name email");

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// SEND IMAGE MESSAGE
export const sendImageMessage = async (req, res, next) => {
  try {
    const { conversationId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imageUrl = req.file.path;

    const message = await Message.create({
      sender: req.user._id,
      content: imageUrl,
      conversation: conversationId,
      type: "image",
      caption: caption || "",
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    await message.populate("sender", "name email");

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// GET MESSAGES
export const getMessages = async (req, res, next) => {
  try {
    const { id: conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    // Mark unread messages from OTHERS as read
    const unreadMessages = messages.filter(
      (msg) =>
        msg.sender._id.toString() !== req.user._id.toString() &&
        msg.status !== "read"
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(m => m._id) } },
        { $set: { status: "read" } }
      );

      // Notify the sender(s) that their messages were read
      const senderId = unreadMessages[0].sender._id.toString();
      req.io.to(senderId).emit("messagesRead", { conversationId });

      // Update local array to reflect changes in response
      unreadMessages.forEach(m => m.status = "read");
    }

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// DELETE CONVERSATION
export const deleteConversation = async (req, res, next) => {
  try {
    const { id: conversationId } = req.params;

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is a participant (can't delete global chat)
    if (conversation.isGlobal) {
      return res.status(403).json({ message: "Cannot delete global chat" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized to delete this chat" });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversationId });

    // Update the conversation to remove lastMessage reference
    // This keeps the chat in the sidebar but shows it as empty
    await Conversation.findByIdAndUpdate(conversationId, {
      $unset: { lastMessage: "" }
    });

    res.json({ message: "Chat messages cleared successfully" });
  } catch (error) {
    next(error);
  }
};
