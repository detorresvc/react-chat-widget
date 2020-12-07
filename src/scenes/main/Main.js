
import React, { useState } from 'react';
import { Container, LeftPane, RightPane } from 'components';
import Room from 'container/room/Room';
import Message from 'container/message/Message';
import FormMessage from 'container/message/FormMessage';
import { useQuery, gql } from 'graphql/client';

const USER = gql`
query onShowUser{
  showUser {
    id,
    name,
    password,
    rooms {
      id,
      name
    },
    consumer {
      id,
      name,
      website_domain,
      access_key,
      created_at,
      updated_at
    }
  }
}
`;

function Main(){

  const { data: { showUser } = { showUser: {} } } = useQuery(USER)
  
  const [selectedRoom, setSelectedRoom] = useState(null)

  const handleSelectRoom = room => e => {
    e.preventDefault()
    setSelectedRoom(room)
  }

  return (
    <Container>
      <LeftPane>
        <div className="flex items-center justify-center h-20 bg-blue-600 text-white">
          <b>{showUser.name}</b>
        </div>
        <Room 
          selected={selectedRoom?.id}
          onSelect={handleSelectRoom}
          />
      </LeftPane>
      <RightPane>
        {selectedRoom &&
          <>
            <div className="flex-1 flex items-end w-full" style={{ height: 'calc(100% - 40px)' }}>
              <Message key={`User${showUser.id}Room${selectedRoom?.id}`} user_id={showUser.id} room_id={selectedRoom?.id}/>
            </div>
            <FormMessage room_id={selectedRoom?.id}/>
          </>
        }
      </RightPane>
    </Container>
  )
}

export default Main