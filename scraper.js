const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'char-creation'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        app.listen(process.env.PORT || PORT, ()=>{
            console.log(`Server running on port ${PORT}, hopefully`)
        })
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let url = 'https://api.pathfinder2.fr/v1/pf2/'
let backgroundData

app.get('/',async (request, response)=>{
    const apiresponse = await fetch(url + 'background',{
        headers: {
            'Authorization': process.env.AuthKey
        }
    })
    const data = await apiresponse.json()
    backgroundData = data
    console.log(data)
    response.render('index.ejs', { background: data.results})
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('pf2e').insertOne({background: backgroundData})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// app.put('/markComplete', (request, response) => {
//     db.collection('pf2e').updateOne({thing: request.body.itemFromJS},{
//         $set: {
//             completed: true
//           }
//     },{
//         sort: {_id: -1},
//         upsert: false
//     })
//     .then(result => {
//         console.log('Marked Complete')
//         response.json('Marked Complete')
//     })
//     .catch(error => console.error(error))

// })

// app.put('/markUnComplete', (request, response) => {
//     db.collection('pf2e').updateOne({thing: request.body.itemFromJS},{
//         $set: {
//             completed: false
//           }
//     },{
//         sort: {_id: -1},
//         upsert: false
//     })
//     .then(result => {
//         console.log('Marked Complete')
//         response.json('Marked Complete')
//     })
//     .catch(error => console.error(error))

// })

// app.delete('/deleteItem', (request, response) => {
//     db.collection('pf2e').deleteOne({thing: request.body.itemFromJS})
//     .then(result => {
//         console.log('Todo Deleted')
//         response.json('Todo Deleted')
//     })
//     .catch(error => console.error(error))

// })

