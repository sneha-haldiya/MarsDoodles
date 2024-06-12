import React , { useState } from 'react'
import { socket } from '../../context/socket';

const Header = ({ roomNumber, isLead }) => {
  const [randomWord, setRandomWord] = useState("");
  const [visStartButton, setVisStartButton] = useState(true);
  const startGame = () => {
    socket.emit("start_game", ({roomNumber}));
  };

  socket.on("display_word",(word) =>{
    setRandomWord(word);
    console.log(" random word-",word);
  })
  socket.on("toggle_start_button",() =>{
    setVisStartButton(!visStartButton);
  })

  const request_disconnect = () => {
    socket.emit("request_disconnect", ({roomNumber}))
  }

  return (
    <div className='flex items-center justify-around rounded-t-md w-[-webkit-fill-available] p-2 bg-[#5d6ec7]'>
      <h2 className='text-4xl font-bold text-white' style={{textShadow: '0px 0px 5px #b393d3, 0px 0px 10px #b393d3, 0px 0px 10px #b393d3,0px 0px 20px #b393d3'}}><i class="fas fa-mars"></i>Mars Doodles</h2>
      {isLead && visStartButton && <button onClick={startGame} className='startBtn'><i class="fa fa-rocket" aria-hidden="true"></i>Start Game</button>}
      <p className='text-2xl font-bold text-white'>{randomWord}</p>
      <button onClick={request_disconnect} className='p-2 bg-red-500 rounded-lg text-white text-[17px]'>Leave Room</button>
    </div>
  )
}

export default Header
