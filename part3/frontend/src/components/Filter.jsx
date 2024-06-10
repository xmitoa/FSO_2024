const Filter = ({ filter, onFilterUpdate }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={onFilterUpdate}></input>
    </div>
  )
}

export default Filter