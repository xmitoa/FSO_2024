let persons = []

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

const errorHandler = (error, request, response, next) => {
    console.log('errorHandler')
    console.log(error)
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

require('dotenv').config()
const Person = require('./models/person')

app.listen(process.env.PORT)

app.get('/api/persons', (req, resp) => {
    console.log('Get all')
    Person.find({}).then(persons => {
        resp.json(persons)
    }) 
    
})

app.get('/info', (req, resp) => {
    Person.find({}).then(persons => {
        const date = Date().toString()
        resp.send(
            `Phonebook has info for ${persons.length} people.
            <br\>
            ${Date()}`)
    }) 
})

app.get('/api/persons/:id', (req, resp, next) => {
    console.log('Get person')
    const foundPerson = Person.findById(req.params.id).then(person => {
        if (person) {
            console.log('Found person')
            resp.json(person)
        }
        else {
            console.log('Person does not exist')
            resp.status(404).end()
        }
    }).catch(error => {
        next(error)
        console.log('Cannot find person:', error)
        resp.status(400).send({ error: 'malformatted id' })
    });
})

app.delete('/api/persons/:id', (req, resp, next) => {
    Person.findByIdAndDelete(req.params.id).then(deleted => {
        resp.status(204).end()
    }). catch(error => next(error))
})

app.post('/api/persons', (req, resp, next) => {
    const body = req.body
    console.log('request: ', req)
    console.log('body: ', body)
    console.log('name: ', body.name)

    const person = new Person({
        name: body.name,
        number: body.number
    })

    console.log('Save!')
    person.save().then(savedPerson => {
        resp.json(person)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, resp, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context:'query'}).then(updatedPerson => {
        if (updatedPerson) {
            console.log('Updated person: ', updatedPerson)
            resp.json(updatedPerson)
        }
        else {
            console.log('Cannot find person')
            resp.status(404).end()
        }
    }).catch(error => next(error))
})
  
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)