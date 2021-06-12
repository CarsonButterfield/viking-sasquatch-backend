const factory = require('./factory');
const mongoose = require('mongoose');
const { model , Schema } = mongoose

const masterNodeSchema = new Schema({
    factories: [factory.schema],
})

masterNodeSchema.methods.createFactories = async function(newFactories){
    try{
        for(let i = 0; i < newFactories; i++){
            let newFactory = await factory.create({})
            console.log(newFactory)
            this.factories.push( newFactory )
        }
        this.save()
    }catch(err){
        console.log(err)
    }
}

const masterNode = model('masterNode',masterNodeSchema)

module.exports = masterNode