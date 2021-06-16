const factory = require('./factory');
const mongoose = require('mongoose');
const { model , Schema } = mongoose

//contains an array of factories, 
const masterNodeSchema = new Schema({
    factories: [factory.schema],
})


// a method to add factories to the master node
masterNodeSchema.methods.createFactories = async function(factoryData){
    try{
            let newFactory = await factory.create(factoryData) //mongoose schema validates this data
            await newFactory.createChildren() //populate the new factory
            this.factories.push( newFactory )
            await this.save() //save the master node
    }catch(err){
        console.log(err)
        res.status(500).json({err:500})
    }
}

const masterNode = model('masterNode',masterNodeSchema)

module.exports = masterNode