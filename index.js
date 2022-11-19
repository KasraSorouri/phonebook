require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'))

app.get('/api/persons',(req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => next (error))
})

app.get('/info',(req, res, next) =>{  
  const time = new Date()
  Person.count({}).then(qty =>{
    res.send(`<p>Phonebook has info for ${qty} people </p>
    <p>${time.toString()}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons/:id',(req, res, next) =>{

  Person.findById(req.params.id).then(person =>{
    res.json(person)
  }).catch(error => next(error))

})

app.delete('/api/persons/:id',(req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons/',(req, res, next) => {
  if (req.body.name) {
    Person.findOne({name : req.body.name}).then(existPerson =>{
      if (existPerson) {
        console.log('existPerson', existPerson)
        return res.status(400).json({error: 'name must be unique'})
      } else {
        const newPerson = new Person({
          name: req.body.name,
          number: req.body.number,
        })
        newPerson.save().then(savedPerson => {
          res.json(savedPerson)
        }).catch(error => next(error))
      }
    })
  } else {
    console.log('name must be provided')
    return res.status(406).json({error: 'name must be provided!'})
  }
}) 

app.put('/api/persons/:id',(req, res, next) => {

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id,newPerson,{ new : true ,runValidators : true , context : 'query'})
    .then(updatePerson => {
      res.json(updatePerson)
    }).catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformated id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => 
  console.log(`Server is running on the port ${PORT}`))