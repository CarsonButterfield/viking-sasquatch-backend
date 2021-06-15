const factory = require('./factory');
const mongoose = require('mongoose');
const { model , Schema } = mongoose

const masterNodeSchema = new Schema({
    factories: [factory.schema],
})


// a method to add factories to the master node
masterNodeSchema.methods.createFactories = async function(factoryData){
    try{
            console.log(factoryData)
            let newFactory = await factory.create(factoryData)
            await newFactory.createChildren()
            this.factories.push( newFactory )
            await this.save()
    }catch(err){
        console.log(err)
        res.status(500).json({err:500})
    }
}

const masterNode = model('masterNode',masterNodeSchema)

module.exports = masterNode