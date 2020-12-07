
import React,{ useEffect } from 'react';
import { useQuery, gql } from 'graphql/client';
import moment from 'moment';

const ROOM_LIST = gql`
query getUserRoom {
  userRooms {
    id,
    name,
    user_id,
    created_at,
    updated_at,
    latest_message {
      message
    }
  }
}
`;

const ROOM_ADDED = gql`
subscription OnRoomAdded{
  roomAdded {
    id
    name,
    user_id,
    created_at,
    updated_at,
    latest_message {
      message
    }
  }
}
`;

const ROOM_UPDATED = gql`
subscription OnRoomUpdated{
  roomUpdated {
    id
    name,
    user_id,
    created_at,
    updated_at,
    latest_message {
      message
    }
  }
}
`;

function Room({ onSelect, selected }){

  const { data: { userRooms } = { userRooms: [] }, subscribeToMore,  stopPolling, networkStatus } = useQuery(ROOM_LIST, { 
    notifyOnNetworkStatusChange: true,
    pollInterval: 60000
   })
  
  useEffect(() => {  
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  const subscribeToNewRoom = () => {
    return networkStatus === 7 && subscribeToMore({
      document: ROOM_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data)    return prev;
  
        const newFeedItem = subscriptionData.data.roomAdded;
        return {
          userRooms: [
            newFeedItem,
            ...prev.userRooms, 
          ]
        }
      }
    })
  }

  const subscribeToUpdatedRoom = () => {
    return networkStatus === 7 && subscribeToMore({
      document: ROOM_UPDATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        const newFeedItem = subscriptionData.data.roomUpdated;
        
        return {
          userRooms: prev.userRooms.map(prevRoom => {
            
            if(+prevRoom.id === +newFeedItem.id)
              return newFeedItem
            return prevRoom
          })
        }
      }
    })
  }

  useEffect(() => {
    const unsubscribeToNewRoom = subscribeToNewRoom()
    const unsubscribeToUpdatedRoom = subscribeToUpdatedRoom()

    return () => {
      if(unsubscribeToNewRoom) unsubscribeToNewRoom()
      if(unsubscribeToUpdatedRoom) unsubscribeToUpdatedRoom()
    }
  }, [networkStatus])

  return (
    <div 
      className="flex flex-col calc(100vh - 81px)"
      style={{
        height: 'calc(100vh - 81px)'
      }}
    >
      {userRooms.map(room => {

        const m1 = moment(new Date());
        const m2 = moment(room.updated_at, "MM/DD/YYYY HH:mm:ss A");

        return (
          <div 
            onClick={onSelect(room)}
            key={`${room.type}${room.id}`} 
            className={`h-20 cursor-pointer overflow-hidden border-b border-gray-300 flex items-center p-2 ${room.id === selected ? 'bg-gray-100' : ''}`}>
            <div className="flex flex-col w-full">
              <p>{room.name}</p>
              <div className="flex">
                <p className="text-xs flex-1 truncate">{room.latest_message?.message}</p>
                <p className="text-xs self-justify-end">{moment.duration(m2.diff(m1)).humanize(true)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Room