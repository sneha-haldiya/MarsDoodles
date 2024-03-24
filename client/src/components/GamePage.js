import React, { useEffect, useState } from 'react'
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

  return (
    <div className='flex flex-col border-8 border-white h-dvh w-dvw'>
      <Header/>
      <SubHeader/>
      <Main roomNumber={roomNumber} userName={userName} />
    </div>

  )
}

export default GamePage