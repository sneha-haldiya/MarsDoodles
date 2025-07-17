// context/socket.js
import React from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect(import.meta.env.VITE_BACKEND_SOCKET_URL, {
  autoConnect: false,
  reconnection: false,
});

export const SocketContext = React.createContext();
