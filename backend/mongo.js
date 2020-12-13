const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://Muhsen:${password}@cluster0.xzlen.mongodb.net/people?retryWrites=true`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})



const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('person', personSchema)

if(process.argv.length<=3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length>3){
const name = process.argv[3]

const number = process.argv[4]

const person = new Person ({
    name: name,
    number: number,
})

person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})
}