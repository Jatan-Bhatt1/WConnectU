import { io } from "socket.io-client";

const socket = io({
  autoConnect: false, // important
});

export default socket;
