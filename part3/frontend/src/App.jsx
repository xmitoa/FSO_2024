import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Input from "./components/Input";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    isAdded: false,
    message: null,
  });

  const updateNotification = (isAdded, message) => {
    setNotification({
      isAdded: isAdded,
      message: message
    });
    setTimeout(() => {
      setNotification({ isAdded: false, message: null });
    }, 3000);
  };

  const onNameUpdate = (event) => {
    setNewName(event.target.value);
  };

  const onNumberUpdate = (event) => {
    setNewNumber(event.target.value);
  };

  const onFilterUpdate = (event) => {
    setFilter(event.target.value);
  };

  const onAdd = (event) => {
    event.preventDefault();
    const foundPerson = persons.find((p) => p.name === newName);
    if (foundPerson) {
      if (
        confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        console.log("Adding");
        const updatedPerson = { ...foundPerson, number: newNumber };
        // Update server
        personService
          .update(foundPerson.id, updatedPerson)
          .then(() => {
            console.log(`${newName} is updated}`);
            // Update local
            setPersons(
              persons.map((person) =>
                person.id === foundPerson.id ? updatedPerson : person
              )
            );
          })
          .catch((error) => {
            console.log("Update failed: ", error);
            if (error.response) {
              if (error.response.status == 404) {
                updateNotification(false, `Information of ${newName} has already been removed from server`);

                setPersons(
                  persons.filter((person) => person.id !== foundPerson.id)
                );
              }
              else {
                updateNotification(false, error.response.data.error);
              }
            }
          });
      } else {
        console.log("Not adding");
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then((personCreate) => {
          console.log("Created person: ", personCreate);
          setPersons(persons.concat(personCreate));
          updateNotification(true, `Added ${personCreate.name}`);
        })
        .catch((error) => {
          console.log("Create failed: ", error.response.data.error)
          updateNotification(false, error.response.data.error);
    });
    }
    setNewName("");
    setNewNumber("");
  };

  const onDelete = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      console.log("Delete");
      personService
        .delete_(person.id)
        .then((res) => {
          console.log("Deleted ", person.name, res);
          setPersons(persons.filter((p) => p.id != person.id));
        })
        .catch((error) => {
          console.log("Delete failed: ", error);
        });
    } else {
      console.log("Not deleting");
    }
  };

  useEffect(() => {
    personService
      .getAll()
      .then((persons) => {
        console.log("Persons received", persons);
        setPersons(persons);
      })
      .catch((error) => console.log("Get failed: ", error));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        isAdded={notification.isAdded}
        message={notification.message}
      />
      <Filter filter={filter} onFilterUpdate={onFilterUpdate} />

      <h3>add a new</h3>
      <Input
        newName={newName}
        newNumber={newNumber}
        onNameUpdate={onNameUpdate}
        onNumberUpdate={onNumberUpdate}
        onAdd={onAdd}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} onDelete={onDelete} />
    </div>
  );
};

export default App;
