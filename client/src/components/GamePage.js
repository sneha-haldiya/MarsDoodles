import React, { useEffect, useState } from 'react'
import Header from './Header'
import SubHeader from './SubHeader'
import Body from './Body'

const GamePage = ({roomNumber ,userName}) => {
  const [roomNum, setRoomNum] = useState(0)
  const [name, setname] = useState("");
  useEffect(() => {
    setRoomNum(roomNumber);
    setname(userName);
  }, [roomNumber,userName])

  return (
    <div className='flex flex-col '>
      <Header/>
      <SubHeader/>
      <Body roomNo={roomNum}  nam={name} />

    </div>

  )
}

export default GamePage