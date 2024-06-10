let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => Math.floor(Math.random() * 10000)

const PORT = process.env.PORT || 3001

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

app.listen(PORT)

app.get('/api/persons', (req, resp) => {
    console.log('Get all')
    resp.json(persons)
})

app.get('/info', (req, resp) => {
    const date = Date().toString()
    resp.send(
        `Phonebook has info for ${persons.length} people.
        <br\>
        ${Date()}`)
})

app.get('/api/persons/:id', (req, resp) => {
    console.log('Get person')
    const foundPerson = persons.find(person => person.id === Number(req.params.id));
    if (foundPerson) {
        console.log('Found person')
        resp.json(foundPerson)
    }
    else {
        console.log('Cannot find person')
        resp.status(400).end()
    }
})

app.delete('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    resp.status(204).end()
})

app.post('/api/persons', (req, resp) => {
    const body = req.body
    console.log('request: ', req)
    console.log('body: ', body)
    console.log('name: ', body.name)

    if (!body.name) {
        return resp.status(400).json({ 
            error: 'name is missing'
        })
    }
    else if (!body.number) {
        return resp.status(400).json({ 
            error: 'number is missing'
        })
    }
    else if (persons.find(person => person.name === body.name)) {
        return resp.status(409).json({ 
            error: 'name must be unique'
        })
    }

    person = {
        name: body.name,
        number: body.number ? body.number : '',
        id: generateId()
    }

    persons.push(person)

    resp.json(person)
})