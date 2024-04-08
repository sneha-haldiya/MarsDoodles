import React from 'react'

const TextBot
 = (data) => {
    console.log("component m hu")
    return (
        <div className='flex justify-center container m-1 overflow-x-hidden'>
            <div className="h-min w-[90%] p-2 bg-gray-200 text-black rounded-lg">
                <p className="font-semibold">{data.author}🤖</p>
                <p className='text-center text-md mb-1 break-all'>{data.mess}</p>
                <p className='text-xs'>{data.time}</p>
            </div>
        </div>
    )
}

export default TextBot