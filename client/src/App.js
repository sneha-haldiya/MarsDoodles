import React, { useEffect, useState } from 'react'
import JoinPage from './components/LandingPage/JoinPage'
import CreateRoomPage from './components/LandingPage/CreateRoomPage'
import GamePage from './components/GamePage'

import { SocketContext, socket } from './context/socket'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(true)
  const [roomNumber, setRoomNumber] = useState(0);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    socket.on("join_successfull", ({ roomName, playerName }) => {
      setRoomNumber(roomName);
      setUserName(playerName);
      console.log("(client)join successful in=" + roomName)
      setLoginVisible(false);
    })
    socket.on("join_unsuccessful", (message) => {
      alert(message);
    })
  }, [socket, roomNumber, userName])



  return (
    <SocketContext.Provider value={socket}>
      <div>
        {loginVisible && <div style={{ height: '100vh', width: '100vw', backgroundColor: 'lightblue' }} className='flex gap-10 justify-center items-center'>
          <JoinPage />
          <CreateRoomPage />
        </div>}
        {!loginVisible && <div className=''>
          <GamePage roomNumber={roomNumber} userName={userName} />
        </div>}
      </div>
    </SocketContext.Provider>


  )
}

export default App
