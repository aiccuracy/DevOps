const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(require('./api'));


mongoose.connect(process.env.production, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected!!')).catch(error => console.log(error))


app.get('/', (req, res) => { 
    res.status(200).send('OK');
})

app.listen(port, () => { 
    console.log(`Express App on port ${port}!`)
})

