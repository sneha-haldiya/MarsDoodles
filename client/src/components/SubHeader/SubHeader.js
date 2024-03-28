import React from 'react'
import ColourPalette from '../Main/Canvas/ColourPalette'

const SubHeader = (props) => {
  return (
    <div className='flex justify-center bg-orange-200 max-w-full p-5'>
      <ColourPalette {...props}/>
    </div>
  )
}

export default SubHeader
