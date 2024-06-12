import React, { useContext, useState } from 'react';
import { SocketContext } from '../../context/socket';
import ColourPalette from '../Main/Canvas/ColourPalette'


const SubHeader = (props) => {
  const socket = useContext(SocketContext);
  const [timer, setTimer] = useState(0);
  socket.on("set_time_init", ({time}) => {
    setTimer(time);
  })
  socket.on("update_timer", ({updatedTimer}) => {
    console.log(updatedTimer);
    setTimer(updatedTimer);
  });

  return (
    <div className='flex justify-around items-center bg-[#e2e7fe] max-w-full p-2 pr-7'>
      {props.isLead && <ColourPalette {...props} />}
      <div className='flex flex-row items-center p-2'>
        <span>⌛</span>
        <span>{timer}</span>
      </div>
    </div>
  )
}

export default SubHeader
