const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/Cluster0',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
});

const db = mongoose.connection;

db.on("error", () => {
    console.log("Error occured from the database!!");
});
db.once("open", () => { 
    console.log("Successfully opened the database!!");
})

module.exports = mongoose;