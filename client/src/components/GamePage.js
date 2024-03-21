import React, { useEffect, useState } from 'react'

const GamePage = ({rm}) => {
  const [roomname, setRoomname] = useState(0)
  useEffect(() => {
    setRoomname(rm);
  },[rm])
  return (
    <div>GamePage{roomname === null ? "" : roomname}</div>
  )
}

export default GamePage