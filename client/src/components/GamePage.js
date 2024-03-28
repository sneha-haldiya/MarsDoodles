import React, {useState} from 'react'
import Header from './Header/Header'
import SubHeader from './SubHeader/SubHeader'
import Main from './Main/Main'

const GamePage = ({roomNumber ,userName}) => {
/*   const [roomNum, setRoomNum] = useState(0)
  const [name, setname] = useState("");
  useEffect(() => {
    setRoomNum(roomNumber);
    setname(userName);
  }, [roomNumber,userName]) */
  const [data, setData] = useState({ color: "#ffffff", size: "8" })
  const [mode, setMode] = useState("draw");
  return (
    <div className='flex flex-col border-8 border-white h-dvh w-dvw'>
      <Header/>
      <SubHeader data={data} setData={setData} setMode={setMode}/>
      <Main roomNumber={roomNumber} userName={userName} data={data} mode={mode}/>
    </div>

  )
}

export default GamePage