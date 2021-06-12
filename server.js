const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./models')
const config = require('./config.json')


//MIDDLEWARE
app.use(bodyParser.json())

app.post('/populateFactories', async (req, res) => {
    try{
        const masterNode = await db.masterNode.findOne({});
        for(let factory of masterNode.factories){
            await factory.createChildren()
        }
        await masterNode.save();
        res.status(200).json({msg:'success'})
    }catch(err){
        console.log(err)
        res.status(500).json({err})
    }
})

//deletes the old master node and replaces it with a new one
app.post('/reset', async ( req, res ) => {
    try{
        await db.masterNode.deleteMany({}); // just to be safe, in case I accidentally create multiple
        const newMaster = await db.masterNode.create({})
        await newMaster.createFactories(3)
        
        res.status(200).json(newMaster)
    } catch(err){
        console.log(err)
        res.status(500).send(err)
    } 
} )
// index route, sends the master node back to the user
app.get('/', async (req, res) => {
   try {
        const masterNode = await db.masterNode.findOne({})
        
        res.send(masterNode)
   } catch (err) {
        console.log(err)
        res.status(500).json(err)
   }
})




app.listen(config.PORT, err => {
    if(err) return console.log(err);
    console.log(`Listening on port ${config.PORT}`)
})

