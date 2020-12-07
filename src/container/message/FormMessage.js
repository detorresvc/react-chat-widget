
import React, { useState } from 'react';
import { useMutation, gql } from '../../graphql/client';
import { Icon } from '../../components';
import './hover.css';

const ADD_MESSAGES = gql`
mutation SendMessage($room_id: ID!, $message: String!){
  createMessage(room_id:$room_id, message:$message)
}
`;

const ADD_ATTACHMENT = gql`
mutation SendAttachment($room_id: ID!, $files: [Upload!]!){
  createAttachment(room_id:$room_id, files: $files)
}
`;

function FormMessage({ room_id }){
  const [message, setMessage] = useState('')
  const [addMessage] = useMutation(ADD_MESSAGES) 
  const [addAttachment] = useMutation(ADD_ATTACHMENT)

  const onAddMessage = e => {
    e.preventDefault()
    addMessage({
      variables: {
        message: message,
        room_id
      }
    })
    setMessage('')
  }

  const onChangeUpload = e => {
    e.preventDefault()
    const files = e.target.files
    
    addAttachment({
      variables: {
        files,
        room_id
      }
    })
  }

  return (
    <form onSubmit={onAddMessage} className="flex p-1 items-center justify-center border-t">
      <div className="flex mr-1 relative hover-trigger">
        <div className="absolute -top-12 left-0 w-32 flex flex-col space-y-1 bg-gray-300 rounded px-2 py-1 hover-target">
          <label className="flex items-center cursor-pointer">
            <span className="text-sm leading-normal">Attach Image</span>
            <input 
              className="hidden"
              accept="image/*"
              multiple
              type="file"
              onChange={onChangeUpload}
            />   
          </label>
          <label className="flex items-center cursor-pointer">
            <span className="text-sm leading-normal">Attach Video</span>
            <input 
              className="hidden"
              accept="video/*"
              multiple
              type="file"
              onChange={onChangeUpload}
            />   
          </label>
        </div>
        <Icon.CirclePlus className="m-auto w-5 h-5 cursor-pointer"/>
      </div>
      <input 
        placeholder="Type a message..."
        className="border border-gray-300 rounded-full flex-1 h-8 px-5"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
    </form>
  )
}

export default FormMessage