import React from 'react'

const ColourPalette = (props) => {
  return (
    <div className='flex justify-evenly items-center w-[-webkit-fill-available]'>
      <input type='color' className='outline-none size-8' onChange={e => props.setData({ ...props.data, color: e.target.value })} value={props.data.color} />
      <input type='range' min="2" max="20" step="2" onChange={e => props.setData({ ...props.data, size: e.target.value })} value={props.data.size} />
      <div className='flex'>
          <button className='bg-yellow-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => props.setMode("brush")}>pencil</button>
          <button className='bg-red-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => props.setMode("circle")}>circle</button>
          <button className='bg-blue-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => props.setMode("rectangle")}>rectangle</button>
          <button className='bg-green-300 pt-1 p-2 rounded-xl w-[-webkit-fill-available] ' onClick={() => props.setMode("floodfill")}>floodfill</button>
      </div>
    </div>
  )
}

export default ColourPalette