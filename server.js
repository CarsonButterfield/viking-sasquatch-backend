const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const db = require('./models')
const config = require('./config.json')

const corsOptions = {
    origin:config.origin,
}
//sends the updated node tree through the websocket
const updateMessage = (masterNode) => {
    expressWs.getWss().clients.forEach(client => {
        client.send(masterNode)
    })
    
    
}
//MIDDLEWARE
app.use(bodyParser.json())
app.use(cors(corsOptions))

const expressWs = require('express-ws')(app)
//WEBSOCKET
app.ws('/updates', (ws, req) => {
})


app.delete('/factories/:factoryId', async (req, res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        masterNode.factories = masterNode.factories.filter(f => {
            return f._id != req.params.factoryId;
        })
        await masterNode.save();
        res.status(200).json({status:200})
        updateMessage(JSON.stringify(masterNode))
    } catch (err) {
        console.log(err)
        res.status(500).json({err:500})
    }
})

app.post('/factories', async (req, res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        await masterNode.createFactories(1)
        res.status(200).json(masterNode)

    } catch (err) {
        console.log(err)
        res.status(500).json({err:500})
    }
})

//Factory updates
app.put('/factories/:factoryId', async (req, res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        const factory = masterNode.factories.find( f => {
            console.log(f._id)
            return f._id == req.params.factoryId 
        })
        if(!factory) return res.status(404).json({err:404});
        // console.log(factory.schema.obj)
        for(value in factory.schema.obj){ // assigning combatible values from the user
            if (req.body[value]){
                factory[value] = req.body[value]
            }
        }
        await masterNode.save()
        res.status(200).json({masterNode})
    }catch(err){
        console.log(err)
        res.status(500).json({err:500})
    }
})

app.put('/factories/:factoryId/children', async ( req , res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        factory = masterNode.factories.find( f => {
            return f._id == req.params.factoryId
        })
        console.log(factory)
        await factory.createChildren()
        await masterNode.save()
        res.status(200).json(masterNode)
    } catch (err) {
        console.log(err)
        res.status(500).json({err:500})
    }
})

app.post('/factories/children', async (req, res) => {
    try{
        const masterNode = await db.masterNode.findOne({})
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

