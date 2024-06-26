import React from 'react'
import Sidebar from './SideBar/Sidebar'
import Canvas from './Canvas/Canvas'
import Chatbar from './ChatBar/Chatbar'


const Main = ({ roomNumber, userName, data, mode, isHost, isLead }) => {

  return (
    <div className='rounded-br-xl' style={{display: 'grid', gridTemplateColumns: '1fr 3fr 1fr' }}>
      <Sidebar roomNumber = {roomNumber} isHost={isHost} isLead={isLead}/>
      <Canvas data={data} mode={mode} roomNumber={roomNumber} isLead={isLead}/>
      <Chatbar roomNumber={roomNumber} userName={userName} isLead={isLead}/>
    </div>
  )
}

export default Main
