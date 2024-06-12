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
      <div className='font-sans'>
      {loginVisible && (
          <div className="h-screen w-screen flex justify-center items-center"
          style={{
            backgroundImage: "url('https://img.freepik.com/premium-photo/sapphire-serenity-blur-abstract-background-captivating-sapphire-hues_954894-11575.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          >
            <div className="flex flex-col items-center bg-black bg-opacity-55 justify-center w-11/12 md:w-3/4 lg:w-2/3 shadow-md rounded-lg pt-8 md:p-8 text-center  border-white border-2" style={{boxShadow: '0 0 17px 10px rgb(0, 183, 255)'}}>
              <h1 className="text-3xl md:text-4xl font-bold mb-4"  style={{color: 'white', textShadow: '0px 0px 20px #00d0ff, 0px 0px 10px #aa00ff, 0px 0px 10px #00ffd9, 0px 0px 20px #778abb' }}><i className="fas fa-mars mr-4"></i> Mars Doodles</h1>
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-around pb-4">
              <JoinPage />
              <CreateRoomPage />
              </div>
            </div>
          </div>
        )}
        {!loginVisible && <div>
          <GamePage roomNumber={roomNumber} userName={userName} isHost={isHost} isLead={isLead} />
        </div>}
      </div>
    </SocketContext.Provider>


  )
}

export default App
