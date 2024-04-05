import React from 'react'

const TextSend = (data) => {
    console.log(data)
    return (
        <div className='flex justify-end container m-1 overflow-x-hidden'>
            <div className="h-min w-[70%] p-2 pl-4 bg-orange-100  text-black rounded-lg">
                <p className="font-bold">{data.author}</p>
                <p className='text-pretty w-inherit break-all text-sm mb-1'>{data.mess}</p>
                <p className='text-xs'>{data.time}</p>
            </div>
        </div>
    )
}

export default TextSend