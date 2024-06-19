import React, { useState,useEffect,useRef } from 'react'
import JoinPage from './LandingPage/JoinPage'
import CreateRoomPage from './LandingPage/CreateRoomPage'
import GamePage from './GamePage'
import { useLocation } from "react-router-dom";

import { SocketContext, socket } from '../context/socket'

const Home = () => {

  const home = useLocation()
  const [loginVisible, setLoginVisible] = useState(true)
  const [roomNumber, setRoomNumber] = useState(0);
  const [userName, setUserName] = useState(home.state.username);
  const [isHost, setIsHost] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  socket.on("change_username", (value) => {
    setUserName(value);
  })

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/colorful-potions-29571.mp3');
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  socket.on("join_successfull", ({ roomName, playerName, host, lead }) => {
    setRoomNumber(roomName);
    setIsHost(host);
    setIsLead(lead);
    setLoginVisible(false);
  })

  socket.on("update_host", ({ host }) => {
    setIsHost(host);
  })
  socket.on("update_lead", ({ lead }) => {
    setIsLead(lead);
  })
  socket.on("join_unsuccessful", (message) => {
    alert(message);
  })

  socket.on("disconnect_granted", () => {
    setLoginVisible(true);
    setRoomNumber(0);
    setIsHost(false);
    setIsLead(false);
    socket.disconnect();
  })

  return (
    <SocketContext.Provider value={socket}>
      <div className='font-sans'>
        {loginVisible && (
          <div className="h-screen w-screen flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white self-center" style={{ textShadow: '0px 0px 20px #00d0ff, 0px 0px 10px #aa00ff, 0px 0px 10px #00ffd9, 0px 0px 20px #778abb' }}>{userName}</h1>
            <div className="flex flex-col md:flex-row gap-10 m-60 mt-5">
                <JoinPage playerName={userName}/>
                <CreateRoomPage playerName={userName}/>
            </div>
          </div>

        )}
        {!loginVisible && <div>
          <GamePage roomNumber={roomNumber} userName={userName} isHost={isHost} isLead={isLead} />
        </div>}
        {loginVisible && <div className='ml-8 mb-10'>
           <button onClick={toggleMusic} className=" text-white">
                <i className={`fas fa-solid ${isPlaying ? 'fa-volume-up' : 'fa-volume-down'}`}></i>
            </button>
        </div>}
      </div>
    </SocketContext.Provider>
  )
}

export default Home
