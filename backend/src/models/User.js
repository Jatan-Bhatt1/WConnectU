import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Hey there! I am using WConnectU",
    },
    lastSeen: {
      type: Date,
    },
    privacy: {
      lastSeen: {
        type: String,
        enum: ["Everyone", "My Contacts", "Nobody"],
        default: "Everyone",
      },
      readReceipts: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
