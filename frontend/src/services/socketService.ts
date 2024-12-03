import { io, Socket } from "socket.io-client";

// Backend URL (use environment variable or fallback to localhost)
const SOCKET_URL = "http://localhost:5000";

// Initialize the Socket.io client
const socket: Socket = io(SOCKET_URL, {
  withCredentials: true, // Ensures cookies are sent with requests
});

export default socket;
