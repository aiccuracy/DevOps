const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const config = require('config');
const { send } = require('process');
const { request } = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
const { Int32 } = require('mongodb');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://172.18.0.2/16', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log("we are connected!")
});


var userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    age: { type: Number }
})

var userCount = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    totalUser: {type: Number}
})

module.exports = mongoose.model('Users', userSchema)


app.get('/users', async (req, res) => {
    db.collection('allUsers').find().toArray((error, result) => {
        res.send(result);
    });
});

app.get('/users/:id', async (req, res) => {
    let id = req.params.id;
    db.collection('allUsers').findOne({ _id: parseInt(id) }, (error, result) => {
        if (result) { return res.send(result.name) }
        else { return res.send(result) };
    });
});


app.post('/users', async (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    if (name) {
        db.collection('userCount').findOne({ name: 'counter' }, (error, result) => {
            var numUser = result.totalUser;
            db.collection('allUsers').insertOne({ _id: numUser + 1, name: name, age: age }, (error, result) => {
                console.log(error);
                db.collection('userCount').updateOne({ name: 'counter' }, { $inc: { totalUser: 1 } }, (error, result) => {
                    if (error) { return res.send(false) }
                    else { return res.send(true) };
                });
            });
        })
    } else {
        return res.send(false);
    }
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const age = req.body.age;
    db.collection('allUsers').updateOne({ _id: parseInt(id) }, { $set: { name: name, age: age } }, (error, result) => {
        if (error) { return es.send(false) }
        else if (result.modifiedCount === 1) { return res.send(true) }
        else { return res.send(false) };
    })
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    db.collection('allUsers').deleteOne({ _id: parseInt(id) }, { justOne: true }, (error, result) => {
        if (error) { return res.send(false) }
        else if (result.deletedCount === 1) {
            return res.send(true);
        } else {
            return res.send(false);
        }
    })
});




