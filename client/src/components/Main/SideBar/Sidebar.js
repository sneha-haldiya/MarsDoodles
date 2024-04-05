import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../context/socket';


const Sidebar = ({roomNumber}) => {
  const socket = useContext(SocketContext);
  const [list, setList] = useState([]);

  socket.on("update", (l) => {
    setList(l.map((p, index) => 
      <li key={index}>{p.playerName}</li>
    ))
  });

  return (
    <div className='flex flex-col bg-pink-200 max-w-full p-5'>
      <h1>Room Id:</h1>
      <h1>{roomNumber}</h1>
      <h1>Players:</h1>
      <div>{list}</div>
    </div>
  )
}

export default Sidebar