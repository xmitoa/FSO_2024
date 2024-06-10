const Input = ({ newName, newNumber, onNameUpdate, onNumberUpdate, onAdd }) => {
  return (
    <>
      <form>
        <div>
          name: <input value={newName} onChange={onNameUpdate} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onNumberUpdate} />
        </div>
        <div>
          <button type="submit" onClick={onAdd}>add</button>
        </div>
      </form>
    </>
  );
};

export default Input