import { io, Socket } from "socket.io-client";
const backendURL = import.meta.env.VITE_BACKEND_URL;

// Backend URL (use environment variable or fallback to localhost)
const SOCKET_URL = backendURL;

// Initialize the Socket.io client
const socket: Socket = io(SOCKET_URL, {
  withCredentials: true, // Ensures cookies are sent with requests
});

export default socket;
