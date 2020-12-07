function InputWithLabel(props){
  return (
    <div>
      <label className="text-sm">{props.label}</label>
      {props.children}
    </div>
  )
}

export default InputWithLabel