# 🎨 Mars Doodles

A real-time, multiplayer draw-and-guess game where users can create or join rooms, draw assigned words, and guess what others are drawing — all in a collaborative, interactive environment. Built using the MERN stack with real-time communication powered by Socket.IO.

---

## Features

- **Multiplayer Game**: One player draws a word while others try to guess it in real time.
- **Authentication**: Secure login/signup functionality for all players.
- **Real-time Chat**: Includes profanity filtering using the `bad-words` package.
- **Drawing Tools**: 
  - Multiple brush sizes and styles
  - Bucket Fill
  - Shape tools (rectangle, circle, etc.)
- **Admin Controls**: Room admin can kick users if necessary.
- **Real-time Updates**: Canvas and chat are synced across all users using WebSockets.

---

## Tech Stack

**Frontend:**  
- HTML  
- Tailwind CSS  
- JavaScript  
- React
- Socket.IO Client

**Backend:**  
- Node.js  
- Express  
- MongoDB (via Mongoose)  
- Socket.IO  
- CORS  
- Nodemon

---

## Architecture Overview

```plaintext
[User]
 │
 ▼
[React Frontend] (Canvas, Chat, Auth)
 │
 ▼
[Socket.IO Client]
 │
 ▼
[Socket.IO Server] ──> Broadcasts canvas & chat events
 │
 ├─> Express Routes (/login, /signup, etc.)
 └─> MongoDB (Stores user credentials & session data)
```
---

## Install dependencies

- For Server: npm i express nodemon cors socket.io random-words bad-words mongoose
- For Client: npm install socket.io-client react-router-dom