
const mongoose = require('mongoose')

const config = require('../config.json')


const DBURI = process.env.MONGODB_URI || `mongodb+srv://CButterfield:${config.DBpassword}@cluster0.byf9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(`MongoDB connection error": ${err}`));

  module.exports = {
  factory : require('./factory'),
  masterNode : require('./masterNode'),
}