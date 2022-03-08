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

const db = require('./db.js');

app.listen(8001, () => { 
    console.log('Express App on port 8001!');
})

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




