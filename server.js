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


app.get('/',async (request, response)=>{
    const playerAncestry = await db.collection('pf2e').find({"ancestry": {$exists: true}}).toArray()
    ancestryList = playerAncestry[0].ancestry.results
    const playerBackground = await db.collection('pf2e').find({"background": {$exists: true}}).toArray()
    backgroundList = playerBackground[0].background.results
    const playerClasses = await db.collection('pf2e').find({"classes": {$exists: true}}).toArray()
    classList = playerClasses[0].classes.results
    // const itemsLeft = await db.collection('pf2e').countDocuments({completed: false})
    response.render('index.ejs', {ancestry: ancestryList, background: backgroundList, classes: classList})
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// app.post('/addTodo', (request, response) => {
//     db.collection('pf2e').insertOne({thing: request.body.todoItem,})
//     .then(result => {
//         console.log('Todo Added')
//         response.redirect('/')
//     })
//     .catch(error => console.error(error))
// })

app.get('/getDescription', (request, response) => {
    db.collection('pf2e').find().toArray()
    .then(result => {
        console.log(result)
        response.json(result)
    })
    .catch(error => console.error(error))

})

// app.put('/markUnComplete', (request, response) => {
//     db.collection('to-do-list').updateOne({thing: request.body.itemFromJS},{
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

app.delete('/deleteItem', (request, response) => {
    db.collection('pf2e').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

