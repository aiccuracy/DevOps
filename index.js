const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(require('./api'));
app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.db.connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected!!')).catch(error => console.log(error))


app.get('/', (req, res) => { 
    res.send('Start!')
})

app.listen(port, () => { 
    console.log(`Express App on port ${port}!`)
})
