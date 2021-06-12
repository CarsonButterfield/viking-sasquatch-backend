const express = require('express')
const app = express()
const db = require('./models')
const config = require('./config.json')



app.post('/reset', async ( req, res ) => {
    try{
        await db.masterNode.deleteMany({});
        const newMaster = await db.masterNode.create({
            factoryCount:3,
        })
        
        res.status(200).json(newMaster)
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    } 
} )
// index route, sends the master node back to the user
app.get('/', async (req, res) => {
   try {
        const data = await db.masterNode.findOne({})
        res.send(data)
   } catch (err) {
        console.log(err)
        res.status(500).json(err)
   }
})




app.listen(config.PORT, err => {
    if(err) return console.log(err);
    console.log(`Listening on port ${config.PORT}`)
})

