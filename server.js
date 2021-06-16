const express = require('express')
const cors = require('cors')
const app = express()
const expressWs = require('express-ws')(app)
const bodyParser = require('body-parser')
const db = require('./models')


const corsOptions = {
    origin:"*",
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

//WEBSOCKET
app.ws('/updates', (ws, req) => {

})



//FACTORY ROUTES

//deletes a factory by ID
app.delete('/factories/:factoryId', async (req, res) => {
    //Try catch blocks with async/await arent quite as effecient as callbacks but I thought readability was more important for a code challenge
    try {
        const masterNode = await db.masterNode.findOne({})
        //Vanilla js method to find and remove the embedded factory
        masterNode.factories = masterNode.factories.filter(f => {
            return f._id != req.params.factoryId;
        })
        await masterNode.save(); //saving the changes back to the database
        res.status(200).json({status:200})
        updateMessage(JSON.stringify(masterNode))
    } catch (err) {
        console.log(err)
        res.status(500).json({err:500})
    }
})

//creates a new factory from a users input
app.post('/factories', async (req, res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        await masterNode.createFactories(req.body) //mongoose handles validation
        res.status(201).json({status:201})
        updateMessage(JSON.stringify(masterNode)) //send out the new data

    } catch (err) {
        console.log(err)
        res.status(500).json({err:500})
    }
})

//Factory updates a factory by any passed values, using id
app.put('/factories/:factoryId', async (req, res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        const factory = masterNode.factories.find( f => {
            return f._id == req.params.factoryId 
        })
        if(!factory) return res.status(404).json({err:404}); //In case no factory is found with that id

        for(key in factory.schema.obj){ // assigning combatible values from the user using the db schema
            if (req.body[key]){
                factory[key] = req.body[key]
            }
        }
        await masterNode.save() 
        res.status(200)
        updateMessage(JSON.stringify(masterNode)) //websocket 
    }catch(err){
        console.log(err)
        res.status(500).json({err:500})
    }
})

//create the chidlren of a specific factory
app.put('/factories/:factoryId/children', async ( req , res) => {
    try {
        const masterNode = await db.masterNode.findOne({})
        factory = masterNode.factories.find( f => {
            return f._id == req.params.factoryId
        })

        if(!factory){ //in case the factory is not found
            return res.status(404).json({status:404})
        }
        await factory.createChildren() //making the children with the instance method
        await masterNode.save()
        res.status(200).json({status:200})
        updateMessage(JSON.stringify(masterNode)) //websocket 
    } catch (err) {
        console.log(err)
        res.status(500).json({err:500})
    }
})

//populate all factories with children, not used by any routes on the frontend but left in just in case
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
//not used on the frontend
app.post('/reset', async ( req, res ) => {
    try{
        await db.masterNode.deleteMany({}); // just to be safe, in case I accidentally create multiple
        const newMaster = await db.masterNode.create({})
        
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




app.listen(process.env.PORT, err => {
    if(err) return console.log(err);
    console.log(`Listening on port ${process.env.PORT}`)
})

