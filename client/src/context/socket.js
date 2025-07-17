// context/socket.js
import React from "react";
import socketio from "socket.io-client";

const socketURL = process.env.REACT_APP_BACKEND_SOCKET_URL;

export const socket = socketio.connect(socketURL, {
  autoConnect: false,
  reconnection: false,
});

export const SocketContext = React.createContext();