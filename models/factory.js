const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const factorySchema = new Schema({
    name:String,
    maxVal:{
        type:Number,
        default:25,
        max:1000,
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
//The method to create this factories children
factorySchema.methods.createChildren = function(){
    this.children = []; // removing the old children
    for(let i = 0; i < this.childCount; i++){
        const newVal = Math.floor((Math.random() * (this.maxVal - this.minVal + 1)) + this.minVal);//generating children within range (inclusive)
        this.children.push(newVal)
    }
    //because the factories are embedded the master node must be saved after this function is called 
}

const factory = model('Factory', factorySchema)


module.exports = factory