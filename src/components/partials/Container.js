import React from 'react';

function Container(props){
  return (
    <div className="w-full h-screen flex">
      {props.children}
    </div>
  )
}

export default Container