import React, { useContext, useState } from 'react';
import { SocketContext } from '../../context/socket';
import ColourPalette from '../Main/Canvas/ColourPalette'


const SubHeader = (props) => {
  const socket = useContext(SocketContext);
  const [timer, setTimer] = useState(30);

  socket.on("update_timer", (updatedTimer) => {
    setTimer(updatedTimer);
  });

  return (
    <div className='flex justify-around bg-orange-200 max-w-full p-5'>
      <ColourPalette {...props} />
      <h1>{timer}</h1>
    </div>
  )
}

export default SubHeader
