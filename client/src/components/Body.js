
import React, { useEffect, useState } from 'react'
import ChatSidebar from './chatsidebar/ChatSidebar'
import Canvas from './canvas/Canvas'
import Chatbar from './chatbar/Chatbar'

const Body = ({ roomNo, nam }) => {
  const [No, setRoomNo] = useState(0)
  const [userN, setusername] = useState("");
  useEffect(() => {
    setRoomNo(roomNo);
    setusername(nam);
  }, [roomNo, nam])

  return (
    <div style={{ height: '78vh', display: 'grid', gridTemplateColumns: '1fr 3fr 1fr' }} className=' max-w-full '>
      <ChatSidebar />
      <Canvas />
      <Chatbar rn={No} un={userN} />
    </div>
  )
}

export default Body
