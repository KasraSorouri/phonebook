const express = require('express');

const app = express();
app.use(express.json())


const idgenator = () => Math.floor(Math.random()*1000000)


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

app.get('/api/persons',(req, res) => {
  res.json(persons)
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

app.delete('/api/persons/:id',(req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
//  console.log('del ->',id,'    porson ->',persons);
  res.status(204).end()
})

app.post('/api/persons/',(req, res) => {
//  console.log('body ->',req.body)
  const newPerson = {
    id: idgenator(),
    name: req.body.name,
    number: req.body.number
  }
  persons = persons.concat(newPerson)

  res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => 
    console.log(`Server is running on the port ${PORT}`))