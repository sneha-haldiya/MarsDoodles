
import React from 'react'
import Sidebar from './SideBar/Sidebar'
import Canvas from './Canvas/Canvas'
import Chatbar from './ChatBar/Chatbar'


const Main = ({ roomNumber, userName, data, mode }) => {
  /* const [No, setRoomNo] = useState(0)
  const [userN, setusername] = useState("");
  useEffect(() => {
    setRoomNo(roomNo);
    setusername(nam);
  }, [roomNo, nam]) */
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 3fr 1fr' }} className='h-[-webkit-fill-available]'>
      <Sidebar roomNumber = {roomNumber}/>
      <Canvas data={data} mode={mode}/>
      <Chatbar roomNumber={roomNumber} userName={userName} />
    </div>
  )
}

export default Main
