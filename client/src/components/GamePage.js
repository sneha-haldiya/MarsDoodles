import React, {useState} from 'react'
import Header from './Header/Header'
import SubHeader from './SubHeader/SubHeader'
import Main from './Main/Main'

const GamePage = ({roomNumber ,userName, isHost, isLead}) => {
/*   const [roomNum, setRoomNum] = useState(0)
  const [name, setname] = useState("");
  useEffect(() => {
    setRoomNum(roomNumber);
    setname(userName);
  }, [roomNumber,userName]) */
  const [data, setData] = useState({ color: "#FFC0CB", size: "8" })
  const [mode, setMode] = useState("draw");
  return (
    <div className='flex flex-col p-4 h-dvh w-dvw' style={{
      backgroundImage: "url('https://img.freepik.com/premium-photo/sapphire-serenity-blur-abstract-background-captivating-sapphire-hues_954894-11575.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Header  roomNumber={roomNumber} isLead={isLead}/>
      <SubHeader data={data} setData={setData} setMode={setMode} roomNumber={roomNumber} isLead={isLead}/>
      <Main roomNumber={roomNumber} userName={userName} data={data} mode={mode} isHost={isHost} isLead={isLead}/>
    </div>

  )
}

export default GamePage