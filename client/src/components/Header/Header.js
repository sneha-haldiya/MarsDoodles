import React , { useState } from 'react'
import { socket } from '../../context/socket';

const Header = (props) => {
  // const socket = useContext(SocketContext);
  const [randomWord, setRandomWord] = useState("");
  const startGame = () => {
    //console.log("start_game trigger hua!")
    socket.emit("start_game",props.roomNumber);
  };

  socket.on("displayWord",(word) =>{
    setRandomWord(word);
    console.log(" random word-",word);
  });

  return (
    <div className='flex items-center justify-between rounded-t-md bg-slate-200 w-[-webkit-fill-available] p-2'>
      <h2 className=''>Mars Doodles</h2>
      <button onClick={startGame}>Start Game</button>
      <p>{randomWord}</p>
      <button onClick={() => window.location.reload()} className='p-1 pl-2 pr-2 bg-red-500'>Leave</button>
    </div>
  )
}

export default Header
