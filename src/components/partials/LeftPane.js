import React from 'react';

function LeftPane(props){
  return (
    <div className="w-2/12 border-r border-gray-300">
      {props.children}
    </div>
  )
}

export default LeftPane