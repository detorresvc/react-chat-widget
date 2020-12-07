import React from 'react';

function RightPane(props){
  return (
    <div className="flex-1 h-full min-h-full flex flex-col overflow-hidden">
      {props.children}
    </div>
  )
}

export default RightPane