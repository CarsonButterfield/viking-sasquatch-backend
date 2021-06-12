const factory = require('./factory');
const mongoose = require('mongoose');
const { model , Schema } = mongoose

const masterNodeSchema = new Schema({
    factoryCount : Number,
    factories: [factory.schema],
})

const masterNode = model('masterNode',masterNodeSchema)

module.exports = {
    masterNode
}