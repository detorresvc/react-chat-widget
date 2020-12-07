function Button(props){
  return (
    <button className="border rounded text-sm px-2 py-1 bg-blue-800 text-white">
      {props.children}
    </button>
  )
}

export default Button