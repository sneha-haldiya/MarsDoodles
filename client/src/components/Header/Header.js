import React from 'react'

const Header = () => {
  return (
    <div className='flex items-center justify-between rounded-t-md bg-slate-200 w-[-webkit-fill-available] p-2'>
      <h2 className=''>Mars Doodles</h2>
      <button onClick={() => window.location.reload()} className='p-1 pl-2 pr-2 bg-red-500'>Leave</button>
    </div>
  )
}

export default Header
