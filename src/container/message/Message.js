import React, { useEffect, useRef } from 'react';
import { useQuery, gql } from '../../graphql/client';
import PlaceHolderAttachment from './PlaceHolderAttachment';
import { Icon } from '../../components';
import moment from 'moment';

const MESSAGES = gql`
query getRoomMessages($room_id: ID!, $page: Int){
  roomMessages(room_id: $room_id, page: $page) {
    pagination {
      page,
      pageCount
    }
    messages {
      id,
      room_id,
      user_id,
      message,
      created_at,
      updated_at,
      user {
        name
      }
      attachments {
        id,
        filename,
        mimetype
      }
    }
  }
}
`;

const MESSAGE_ADDED = gql`
subscription subscibemessage($room_id: ID!){
  messageAdded(room_id: $room_id) {
    id
    room_id
    user_id
    message
    created_at,
    updated_at,
    user {
      name
    }
    attachments {
      id,
      filename,
      mimetype
    }
  }
}
`;


const ATTACHMENT_MESSAGE_ADDED = gql`
subscription subscibemessageAttachment($room_id: ID!) {
  messageAttachmentAdded(room_id: $room_id) {
    id
    room_id
    user_id
    message
    created_at,
    updated_at,
    user {
      name
    }
    attachments {
      id,
      filename,
      mimetype
    }
  }
}
`;

function Message({ user_id, room_id }){
  
  const messagesRef = useRef()
  
  const scrollToBottom = () => {
    const div = messagesRef.current
    if(div)
      div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  const { 
    data: { 
      roomMessages: { messages, pagination } 
    } = { roomMessages: {
      messages: [], 
      pagination: {}
    } }, 
    loading,
    subscribeToMore,
    fetchMore,
    networkStatus
  } = useQuery(MESSAGES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      room_id
    },
    onCompleted: ({ roomMessages }) => {   
      
      if(roomMessages.pagination.page === 1){
        setTimeout(() => {
          scrollToBottom()
        }, 500)
      }
    }
  })
  
  const whichData = (type) => {
    if(type === MESSAGE_ADDED){
      return 'messageAdded'
    }

    if(type === ATTACHMENT_MESSAGE_ADDED){
      return 'messageAttachmentAdded'
    }

    return ''
  }
  
  const subscribeToNewMessage = (type) => {
    
    return networkStatus === 7 && subscribeToMore({
      document: type,
      variables: {
        room_id: +room_id
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        const newFeedItem = subscriptionData.data[whichData(type)];
        
        const isMe = +newFeedItem.user_id === +user_id
        if(isMe){
          setTimeout(() => {
            scrollToBottom()
          }, 500)
        }

        return Object.assign({}, prev, {
          ...prev,
          roomMessages: {
            ...prev.roomMessages,
            messages: [
              ...prev.roomMessages.messages, 
              newFeedItem
            ]
          }
        })
      }
    })
  }
  
  const onHandlefetchMore = () => {
    
    const nextPage = pagination.page + 1
    
    if(nextPage <= pagination.pageCount && networkStatus === 7)

      fetchMore({
        variables: {
          room_id,
          page: nextPage
        },
        updateQuery: (prevData, { fetchMoreResult }) => {

          setTimeout(() => {
          const div = messagesRef.current
          div.scrollTop = div.scrollHeight/fetchMoreResult.roomMessages.pagination.page
          }, 500)

          fetchMoreResult.roomMessages.messages = [
            ...fetchMoreResult.roomMessages.messages,
            ...prevData.roomMessages.messages,
          ]
          return fetchMoreResult
        }
      })
  }

  useEffect(() => {
    
    const unsubscribeToNewMessage = subscribeToNewMessage(MESSAGE_ADDED)
    const unsubscribeToNewMessageAttachment =  subscribeToNewMessage(ATTACHMENT_MESSAGE_ADDED)

    return () => {
      if(unsubscribeToNewMessage) unsubscribeToNewMessage()
      if(unsubscribeToNewMessageAttachment) unsubscribeToNewMessageAttachment()
    }
  }, [networkStatus])

  useEffect(() => {
    const div = messagesRef.current

    const fethMoreMessages = () => {
      if(+div.scrollTop === 0)
        onHandlefetchMore()
    }

    div.addEventListener("scroll", fethMoreMessages);
        
    return () => {
      div.removeEventListener('scroll', fethMoreMessages)
    }
  }, [networkStatus])
  
  
  return (
    <div ref={messagesRef} className={`flex flex-col overflow-y-auto overflow-x-hidden w-full h-full min-h-full max-h-full relative`} >
      {pagination.page === pagination.pageCount && <p className="w-full text-center">*** end of line ***</p>}
      {loading && <p className="w-full text-center absolute h-full flex"><Icon.Spinner className="m-auto animate-spin w-5 h-5" /></p>}
      {messages.map(message => {
        const isMe = +user_id === +message.user_id
        return (
          <div key={`${message.user_id}${message.id}`} className={`flex min-auto flex-col p-2 ${isMe ? 'items-end' : 'items-start'}`}>
            <small className="text-xs">{message.user?.name}</small>
            <div className="my-1">
              {message.attachments?.length > 0 &&
                <div className={`grid ${message.attachments?.length > 3 ? 'grid-cols-3' : 'grid-cols-1'} gap-2 space-y-2 max-w-prose text-sm rounded px-3 py-2 flex-0 ${isMe ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {message.attachments.map(attchmnt => <PlaceHolderAttachment key={`placeholder${attchmnt.id}`} mimetype={attchmnt.mimetype} id={attchmnt.id}/>)}
                </div>
              }
              {message.attachments?.length === 0 &&
                <p className={`max-w-prose text-sm px-3 py-2 flex-0 ${isMe ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'} ${message.message.length > 100 ? 'rounded' : 'rounded-full'}`}>{message.message}</p>
              }
            </div>
            <small className="text-xs">{moment(message.created_at, 'MM/DD/YYYY HH:mm:ss A').format('h:mm: A')}</small>
          </div>
        )
      })}
    </div>
  )

}

export default Message