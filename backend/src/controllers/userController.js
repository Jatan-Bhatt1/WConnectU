import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
// UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// UPDATE SETTINGS
export const updateSettings = async (req, res, next) => {
  try {
    const { privacy } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { privacy },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    next(error);
  }
};
