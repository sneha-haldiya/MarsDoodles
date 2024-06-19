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
 
  const saveImage = () => {
    const canvas = document.getElementById('canvas'); 
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'drawing.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Canvas element not found');
    }
  }

  return (
    <div className='flex justify-around items-center bg-[#e2e7fe] max-w-full p-2 pr-7'>
      <button onClick={saveImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded flex items-center">
      <i class="fas fa-solid fa-download"></i></button>
      {props.isLead && <ColourPalette {...props} />}
      <div className='flex flex-row items-center'>
        <span>⌛</span>
        <span>{timer}</span>
      </div>
    </div>
  )
}

export default SubHeader
