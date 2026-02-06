import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // later restrict to frontend URL
  },
});

/* =======================
   Middleware
======================= */
app.use(cors());
app.use(express.json());

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* =======================
   Routes
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/* =======================
   Error Handler
======================= */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

/* =======================
   Socket.IO Logic
======================= */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // user joins personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // send message
  socket.on("sendMessage", ({ receiverId, message }) => {
    if (receiverId === "GLOBAL") {
      socket.broadcast.emit("receiveMessage", message);
    } else {
      io.to(receiverId).emit("receiveMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
