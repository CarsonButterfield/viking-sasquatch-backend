const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const factorySchema = new Schema({
    name:String,
    maxVal:{
        type:Number,
        default:25,
    },
    minVal:Number,
    childCount:{
        type:Number,
        max:15
    },
    children:[Number],
});

factorySchema.methods.createChildren = function(){
    console.log(this)
}

const factory = model('Factory', factorySchema)


module.exports = factory