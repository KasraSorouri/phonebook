const mongoose = require('mongoose')

const password = process.argv[2]

const url =`mongodb+srv://fs2022:${password}@cluster0.bzwcs.mongodb.net/phonebook-cli?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person',personSchema)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected!')

    if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      return person.save()
        .then(()=> {
          console.log(`added ${process.argv[3]}, number ${process.argv[4]} to phonebook.`)
          return mongoose.connection.close()
        })
    }
    Person.find({}).then(result => {
      console.log('phonebook')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      return mongoose.connection.close()
    })
  })