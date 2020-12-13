import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/person'
import SucNotification from './components/SucNotifications'
import FailNotification from './components/FailNotification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('Martin Fowler')
  const [newNumber, setNewNumber] = useState('040-1234567')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [sucMessage, setSucMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(initialPersons =>
        setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const found = persons.some(person => person.name === newName)


    if (found === true) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService.update(changedPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.name !== newName ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSucMessage(`Updated ${newName}`)
            setTimeout(()=> {
              setSucMessage(null)
            },5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from the server`)
            setTimeout(()=> {
              setErrorMessage(null)
            }, 5000)
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    }
    else {
      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSucMessage(`Added ${newName}`)
          setTimeout(()=> {
            setSucMessage(null)
          },5000)
        })
        .catch(error => {
          console.log(error.response.data)
          setErrorMessage(error.response.data.error)
        })
    }
  }



  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDelete = (object) => {
    if (window.confirm(`Delete ${object.name}?`)) {
      personService.toDelete(object.id)
        .then( response => {
          setPersons(persons.filter(p => p.id !== object.id))
          setSucMessage(`Deleted ${object.name}`)
        })
        .catch(error => {
          setErrorMessage(`Information of ${object.name} has already been removed from the server`)
          setTimeout(()=> {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter))

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }



  return (
    <div>
      <h2>Phonebook</h2>
      <SucNotification message={sucMessage}/>
      <FailNotification message={errorMessage}/>
      <Filter filter={filter} handleFilter={handleFilterChange} />

      <div>
        <h2>add a new</h2>
      </div>

      <PersonForm addPerson={addPerson} newName={newName}
        nameChange={handleNameChange} newNumber={newNumber}
        numberChange={handleNumberChange} />

      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <Persons key={person.id} person={person} handleClick={() => handleDelete(person)} />
      )}
    </div>
  )

}

export default App;
