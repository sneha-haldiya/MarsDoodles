import React from 'react'
import TextReceive from './TextReceive'
import TextSend from './TextSend'

const ChatMessages = (data) => {
    let isSelf = data.isSelf;
  return (
    <div>
    {!isSelf && <TextReceive {...data}/>}
    {isSelf && <TextSend {...data}/>}
    </div>
  )
}

export default ChatMessages