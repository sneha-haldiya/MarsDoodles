import React, { useContext } from 'react'
import { SocketContext } from '../../../context/socket'
const ColourPalette = (props) => {
  const socket = useContext(SocketContext);
  const roomNumber = props.roomNumber;
  const isLead = props.isLead;
  const setColor = (e) => {
    socket.emit("set_color", ({color: e.target.value, roomNumber: roomNumber}));
  }

  const setSize = (e) => {
    socket.emit("set_size", ({size: e.target.value, roomNumber: roomNumber}));
  }

  const setMode = (e) => {
    socket.emit("set_mode", ({mode: e, roomNumber: roomNumber}));
  }
    
  const clearCanvas = () => {
    socket.emit("clear_canvas", { roomNumber });
  }

  socket.on("set_color_client", ({penColor}) => {
    props.setData({ ...props.data, color: penColor});
  })

  socket.on("set_size_client", ({brushSize}) => {
    props.setData({ ...props.data, size: brushSize })
  })

  socket.on("set_mode_client", ({brushMode}) => {
    props.setMode(brushMode);
  })

  return (
    <>
    {isLead && <div className='flex justify-evenly items-center w-[-webkit-fill-available]'>
      <input type='color' className='outline-none size-8' onChange={setColor} value={props.data.color} />
      <input type='range' min="2" max="20" step="2" onChange={setSize} value={props.data.size} id='brushSizeSlider'/>
      <div className='flex justify-between space-x-2'>
          <button className='bg-yellow-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => setMode("brush")}>pencil</button>
          <button className='bg-red-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => setMode("circle")}>circle</button>
          <button className='bg-blue-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => setMode("rectangle")}>rectangle</button>
          <button className='bg-green-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => setMode("floodfill")}>floodfill</button>
          <button className='bg-gray-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available]' onClick={clearCanvas}>clear</button>
      </div>
    </div>}
    </>
    
  )
}

export default ColourPalette