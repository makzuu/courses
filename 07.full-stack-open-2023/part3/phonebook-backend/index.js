require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

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

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => res.json(persons))
})

app.get('/info', (req, res) => {
    const date = new Date()
    const response = `Phonebook has info for ${persons.length} people<br/>${date}`

    res.send(response)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person)
        return res.json(person)

    res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    person.id = Math.floor(Math.random() * 99999)

    // The name or number is missing
    if (!person.name || !person.number)
        return res.status(400).json({ error: 'name or number missing' })

    // The name already exists in the phonebook
    if (persons.find(p => p.name === person.name))
        return res.status(400).json({ error: 'name must be unique' })

    persons = [...persons, person]

    res.status(201).json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
