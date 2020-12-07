import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../components';
import Message from '../../container/message/Message';
import FormMessage from '../../container/message/FormMessage';
import { useQuery, gql, useMutation } from '../../graphql/client';
import Cookies from 'js-cookie';

const CONSUMER = gql`
query onGetConsumer($access_key: String!) {
  getConsumer(access_key:$access_key) {
    name
  }
}
`;

const WIDGET_LOGIN = gql`
mutation onWigetLogIn($access_key: String!, $token: String!){
  widgetLogin(access_key: $access_key, token: $token){
    email,
    id,
    rooms {
      id
    }
  }
}
`;

const CREATE_ROOM = gql`
mutation onCreateRoom{
  createRoom{
    id,
    name
  }  
}
`

function Widget({ access_key, token }){
  
  const [widgetStatus, setWidgetStatus] = useState('validating')
  const [isOpen, setIsOpen] = useState(false)
  const { data  } = useQuery(CONSUMER, {
    variables: {
      access_key
    },
    onCompleted: (data) => {
      if(data?.getConsumer)
        return setWidgetStatus('validating')
      return setWidgetStatus('error')
    }
  })

  const [onCreateRoom, {
    data: roomData
  }] = useMutation(CREATE_ROOM, {
    onCompleted: (data) => {
      if(data?.createRoom)
        return setWidgetStatus('ready')
      return setWidgetStatus('error')
    }
  })

  const [widgetLogin, { 
    data: widgetdata
  }] = useMutation(WIDGET_LOGIN, {
    onCompleted: (data) => {
      
      if(data?.widgetLogin){
        onCreateRoom()
        return setWidgetStatus('validating')
      }
      return setWidgetStatus('error')
    }
  })

  useEffect(() => {
    widgetLogin({
      variables: {
        access_key,
        token
      }
    })

    Cookies.set('echat:token', token)
  }, [])
  
  if(widgetStatus === 'validating'){
    return (
      <div 
        className={`bg-blue-800 rounded-full w-auto fixed bottom-5 right-5 p-3`}>
        <Icon.Spinner className="animate-spin w-10 h-10 fill-current text-white m-auto"/>
      </div>
    )
  }
  
  if(widgetStatus === 'error'){
    return (
      <div 
        title="EChat: Something went wrong!"
        className={`bg-white rounded-full w-auto fixed bottom-5 right-5 p-3`}>
        <Icon.Exclamation className="w-10 h-10 fill-current text-white m-auto"/>
      </div>
    )
  }

  const onShowChat = e => {
    e.preventDefault()
    setIsOpen(prev => !prev)
  }
  
  return (
    <>
      {isOpen &&
      <div 
        className={`
        bg-white
          border
          rounded 
          fixed 
          cursor-pointer 
          ${isOpen ? '' : 'hidden'}
          flex 
          flex-col

          bottom-0
          xl:bottom-5
          lg:bottom-5
          md:bottom-5

          right-0
          xl:right-5
          lg-right-5 
          md-right-5 
          
          h-full
          xl:h-96
          lg:h-96
          md:h-96

          w-full
          xl:w-80
          lg:w-80
          md:w-80

          min-w-full
          xl:min-w-80
          lg:min-w-80
          md:min-w-80
        `}>
        <div className="flex space-x-2 items-center border-b rounded-t h-10 min-h-10 px-2 bg-blue-800">
          <div>
            <Icon.Chat className="w-7 h-7 fill-current text-white"/>
          </div>
          <div className="flex-1 text-white">
            E-Chat: {data?.getConsumer.name}
          </div>
          <div>
            <Icon.Close onClick={onShowChat} className="w-4 h-4 cursor-pointer fill-current text-white" />
          </div>
          
        </div>
        <div className="flex-1 flex overflow-x-hidden overflow-y-auto w-full">
          <Message room_id={+roomData?.createRoom?.id} user_id={+widgetdata?.widgetLogin?.id}/>
        </div>
        <FormMessage room_id={+roomData?.createRoom?.id}/>
      </div>}
      <div 
        onClick={onShowChat}
        className={`bg-blue-800 rounded-full w-auto fixed bottom-5 right-5 p-3 cursor-pointer ${isOpen ? 'hidden' : ''}`}>
        <Icon.Chat className="w-10 h-10 fill-current text-white m-auto"/>
      </div>
    </>
  )
}

Widget.defaultProps = {
  access_key: '456',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjAsImVtYWlsIjoiY2U0MkBlbWFpbC5jb20iLCJpYXQiOjE2MDczMDc3MDIsImV4cCI6MTYwNzM5NDEwMn0.p547rD2ccWlHQED2g-MZ9lqOPA5oyklOTY_8Z378UPs'
}

Widget.propTypes = {
  access_key: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
}

export default Widget