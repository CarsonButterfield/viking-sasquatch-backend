const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const factorySchema = new Schema({
    name:String,
    maxVal:{
        type:Number,
        default:25,
    },
    minVal:{
        type:Number,
        default:1,
    },
    childCount:{
        type:Number,
        max:15,
        default:5
    },
    children:[Number],
});

factorySchema.methods.createChildren = function(){
    this.children = [];
    for(let i = 0; i < this.childCount; i++){
        const newVal = Math.floor((Math.random() * this.maxVal) + this.minVal);
        this.children.push(newVal)
    }
}

const factory = model('Factory', factorySchema)


module.exports = factory