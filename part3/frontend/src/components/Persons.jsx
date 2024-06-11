const Persons = ({ persons, filter, onDelete }) => {
  console.log("Persons: ", persons);
  const numbers = persons
    .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    .map((p) => <PersonLine key={p.id} person={p} onDelete={onDelete} />);
  return <>{numbers}</>;
};

const PersonLine = ({ person, onDelete }) => {
  console.log("Create line", person);
  console.log("Create line", person.name);
  return (
    <>
      {person.name}&nbsp;
      {person.number}&nbsp;
      <button
        onClick={() => {
          onDelete(person)
        }}
      >
        delete
      </button>{" "}
      <br />
    </>
  );
};

export default Persons;
