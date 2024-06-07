import React, { useState } from 'react'
import JoinPage from './components/LandingPage/JoinPage'
import CreateRoomPage from './components/LandingPage/CreateRoomPage'
import GamePage from './components/GamePage'

import { SocketContext, socket } from './context/socket'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(true)
  const [roomNumber, setRoomNumber] = useState(0);
  const [userName, setUserName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isLead, setIsLead] = useState(false);
  socket.on("join_successfull", ({ roomName, playerName, host, lead }) => {
    setRoomNumber(roomName);
    setUserName(playerName);
    setIsHost(host);
    setIsLead(lead);
    setLoginVisible(false);
  })

  socket.on("update_host", ({host}) => {
    setIsHost(host);
  })
  socket.on("update_lead", ({lead}) => {
    setIsLead(lead);
  })
  socket.on("join_unsuccessful", (message) => {
    alert(message);
  })

  socket.on("disconnect_granted", () => {
    setLoginVisible(true);
    setRoomNumber(0);
    setUserName("");
    setIsHost(false);
    setIsLead(false);
    socket.disconnect();
  })

  return (
    <SocketContext.Provider value={socket}>
      <div>
        {loginVisible && <div style={{ height: '100vh', width: '100vw', backgroundColor: 'lightblue' }} className='flex gap-10 justify-center items-center'>
          <JoinPage />
          <CreateRoomPage />
        </div>}
        {!loginVisible && <div className=''>
          <GamePage roomNumber={roomNumber} userName={userName} isHost={isHost} isLead={isLead} />
        </div>}
      </div>
    </SocketContext.Provider>


  )
}

export default App
