import React, { useContext, useState } from 'react'
import { SocketContext } from '../../../context/socket';


const Sidebar = ({roomNumber, isHost, isLead}) => {
  const socket = useContext(SocketContext);
  const [list, setList] = useState([]);

  socket.on("update", (l) => {
    setList(l.map((p, index) => 
      <li key={index}>{p.playerName}{p.isHost ? " (Host)" : null}{p.isLead ? " (Lead)" : null}</li>
    ))
  });

  return (
    <div className='flex flex-col bg-[#9f71db] max-w-full p-5 text-white text-base rounded-bl-md'>
      <h1 className='font-bold'><i class="fas fa-comments"></i> Room Id :</h1>
      <h1>{roomNumber}</h1>
      <h1  className='font-bold'><i class="fas fa-users"></i> Players :</h1>
      <div className='list-none'>{list}</div>
    </div>
  )
}

export default Sidebar