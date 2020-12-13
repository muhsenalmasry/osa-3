require('dotenv').config()
express = require('express')
app = express()
cors = require('cors')
Person = require('./models/person')
var morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('person', function (req, res) {
        return JSON.stringify(req.body)
    })

app.use(morgan(function (tokens, req, res) {
        if (req.method === "POST") {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms',
                tokens['person'](req, res)
            ].join(' ')
        } else {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms'
            ].join(' ')
        }
    }))


app.get('/api/persons', function (req, res) {
        Person.find({}).then(function (persons) {
                res.json(persons.map(function (p) {
                        return p.toJSON()
                    }))
            })
    })

app.get('/info', function (req, res) {
        infos = Person.length
        date = new Date().toString()
        returned = '<p>Phonebook has info of ' + (infos) + ' persons</p>' + (date)
        res.send(returned)
    })

app.get('/api/persons/:id', function (req, res) {
        Person.findById(req.params.id)
            .then(function (person) {
                    return res.json(person)
                })
            .catch(function (error) {
                    res.status(404).end()
                })
    })


app.post('/api/persons', function (req, res, next) {
        body = req.body
        person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(function (savedPerson) {
                res.json(savedPerson)
            })
            .catch(function (error) {
                    return next(error)
                })
    })



app.put('/api/persons/:id', function (req, res, next) {
        body = req.body
        person = {
            name: body.name,
            number: body.number,
        }
        Person.findByIdAndUpdate(req.params.id, person, { new: true })
            .then(function (updatedPerson) {
                    res.json(updatedPerson.toJSON())
                })
            .catch(function (error) {
                    return next(error)
                })
    })

app.delete('/api/persons/:id', function (req, res, next) {
        Person.findByIdAndRemove(req.params.id)
            .then(function (result) {
                    res.status(204).end()
                })
            .catch(function (error) {
                    return next(error)
                })
    })


unknownEndpoint = function (request, response) {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

errorHandler = function (error, request, response, next) {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

generateId = function () {
    maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})