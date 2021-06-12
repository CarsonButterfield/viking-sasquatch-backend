const express = require('express')
const config = require('./config.json')
const app = express()
const db = require('./models')


app.get('/', async (req, res) => {
   try {
        const data = await db.masterNode.findAll()
        res.send(data)
   } catch (err) {
        res.send(err)
   }
})




app.listen(config.PORT, err => {
    if(err) return console.log(err);
    console.log(`Listening on port ${config.PORT}`)
})

