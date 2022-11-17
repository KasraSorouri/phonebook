require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person');
const person = require('./models/person');

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));
//const idgenator = () => Math.floor(Math.random()*1000000)

/*
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
*/
app.get('/api/persons',(req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => next (error))
})

app.get('/info',(req, res) =>{  
  const time = new Date()
  res.send(`<p>Phonebook has infor for ${persons.length} people </p>
            <p>${time.toString()}</p>`)
})

app.get('/api/persons/:id',(req, res) =>{
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404)
    .end()
  }
})

app.delete('/api/persons/:id',(req, res, next) => {
//  const id = Number(req.params.id)
  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
//  persons = persons.filter(person => person.id !== id)
//  console.log('del ->',id,'    porson ->',persons);
})

app.post('/api/persons/',(req, res, next) => {
//  console.log('body ->',req.body)
  if (req.body.name) {
//    console.log('name', req.body.name);
    
//    const existPeson = persons.find(person => person.name === req.body.name) 
//    if (existPeson) {
//      res.json({Error: 'name must be unique'})
//    } else {
      const newPerson = new Person({
//        id: idgenator(),
        name: req.body.name,
        number: req.body.number,
      })
//    persons = persons.concat(newPerson)
      newPerson.save().then(savedPerson => {
        res.json(savedPerson)
      }).catch(error => next(error))
  } else {
    console.log('name must be provided');
    return res.status(406).json({error: 'name must be provided!'})
}
}) 

app.put('/api/persons/:id',(req, res, next) => {

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id,newPerson,{ new : true })
    .then(updatePerson => {
      res.json(updatePerson)
  }).catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformated id'})
  }
  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => 
    console.log(`Server is running on the port ${PORT}`))