//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://lexuankha2409:123456kha@cluster0-bezjf.mongodb.net/mydb?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;