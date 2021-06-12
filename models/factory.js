const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const factorySchema = new Schema({
    name:String,
    maxVal:Number,
    minVal:Number,
    childCount:{
        type:Number,
        max:15
    },
    // children:[Number],

});

const factory = model('Factory', factorySchema)


module.exports = factory