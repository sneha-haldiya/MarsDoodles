// context/socket.js
import React from "react";
import socketio from "socket.io-client";

//OLD
//export const socket = socketio.connect("http://localhost:3001", {autoConnect: false, reconnection: false});
// NEW (use environment variable)
export const socket = socketio.connect(import.meta.env.BACKEND_SOCKET_URL, {
  autoConnect: false,
  reconnection: false,
});

export const SocketContext = React.createContext();
