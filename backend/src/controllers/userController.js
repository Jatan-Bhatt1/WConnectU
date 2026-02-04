import User from "../models/User.js";

// GET ALL USERS (except self)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      blockedUsers: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// SEARCH USERS
export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.q;

    const users = await User.find({
      name: { $regex: keyword, $options: "i" },
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// ADD CONTACT
export const addContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { contacts: contactId },
    });

    res.json({ message: "Contact added" });
  } catch (error) {
    next(error);
  }
};

// REMOVE CONTACT
export const removeContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { contacts: contactId },
    });

    res.json({ message: "Contact removed" });
  } catch (error) {
    next(error);
  }
};

// BLOCK USER
export const blockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { blockedUsers: userId },
      $pull: { contacts: userId },
    });

    res.json({ message: "User blocked" });
  } catch (error) {
    next(error);
  }
};
