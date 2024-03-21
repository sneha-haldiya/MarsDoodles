import React, { useEffect, useState } from 'react'
import JoinPage from './components/JoinPage'
import CreateRoomPage from './components/CreateRoomPage'
import GamePage from './components/GamePage'

import { SocketContext, socket } from './context/socket'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(true)
  const [roomnumber, setRoomNumber] = useState(0);
  useEffect(() => {
    socket.on("join_successfull", (roomname) => {
      setRoomNumber(roomname);
      console.log("(client)join successful in=" + roomname)
      setLoginVisible(false);
    })
    socket.on("join_unsuccessful", (message) => {
      alert(message);
    })
  }, [socket])



  return (
    <SocketContext.Provider value={socket}>
      <div>
        {loginVisible && <div style={{ height: '100vh', width: '100vw', backgroundColor: 'lightblue' }} className='flex gap-10 justify-center items-center'>
          <JoinPage />
          <CreateRoomPage />
        </div>}
        {!loginVisible && <div style={{ height: '100vh', width: '100vw', backgroundColor: 'red' }} className='flex justify-center items-center'>
          <GamePage rm={roomnumber} />
        </div>}
      </div>
    </SocketContext.Provider>


  )
}

export default App
