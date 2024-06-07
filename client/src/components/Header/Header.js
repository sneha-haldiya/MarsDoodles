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
    <div className='flex items-center justify-between rounded-t-md bg-slate-200 w-[-webkit-fill-available] p-2'>
      <h2 className=''>Mars Doodles</h2>
      {isLead && visStartButton && <button onClick={startGame}>Start Game</button>}
      <p>{randomWord}</p>
      <button onClick={request_disconnect} className='p-1 pl-2 pr-2 bg-red-500'>Leave</button>
    </div>
  )
}

export default Header
