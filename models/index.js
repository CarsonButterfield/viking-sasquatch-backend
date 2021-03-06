
const mongoose = require('mongoose')



const DBURI = process.env.DBURI //connects to Mongodb Atlast using ENV configs

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