import React from 'react'

const Sidebar = ({roomNumber}) => {
  return (
    <div className='flex flex-col bg-pink-200 max-w-full p-5'>
      <h1>Room Id:</h1>
      <h1>{roomNumber}</h1>
      <h1>Players:</h1>
      
    </div>
  )
}

export default Sidebar