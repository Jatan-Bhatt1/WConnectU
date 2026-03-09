import { io } from "socket.io-client";

const socket = io("https://wconnectu.onrender.com", {
  autoConnect: false, // important
});

export default socket;
