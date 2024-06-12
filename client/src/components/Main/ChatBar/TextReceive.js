import React from 'react'

const TextReceive
 = (data) => {
    console.log(data)
    return (
        <div className='flex justify-start container m-1 overflow-x-hidden'>
            <div className="h-min w-[60%] p-2 pl-4 bg-orange-100  text-sm text-black rounded-lg">
                <p className="font-bold">{data.author}</p>
                <p className='text-pretty mb-1 break-all'>{data.mess}</p>
                <p className='text-xs'>{data.time}</p>
            </div>
        </div>
    )
}

export default TextReceive
