const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('', async (req, res) => {
    res.send(await User.find({}))
});

router.get('/:id', (req, res, next) => { 
    if (isNaN(parseInt(req.params.id))) {
        return res.status(400).send({ message: 'Invalid user id.' });
    }
    User.findOne({ id: req.params.id }, function (err, user) { 
        if (err) return next(err);
        if (user == null) {
            return res.status(404).send({ message: "The user is not found." });
        } 
        res.status(200).send(user);
    })
})

router.post('', async (req, res, next) => {
    if (req.body.name === undefined) {
        return res.status(400).send({ message: '\'name\' parameter is empty.' });
    }
    if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
        return res.status(400).send({ message: '\'age\' must be an integer.' });
    }
    const checkUser = await User.findOne({ 'name': req.body.name });
    if (checkUser !== null) {
        return res.status(409).send({ message: 'The user already exists.' });
    }
    const user = new User();
    user.name = req.body.name;
    user.age = req.body.age;

    user.save((err) => {
        if (err) return next(err);
        res.status(200).send(user);
     })
})
 
router.put('/:id', async (req, res, next) => {
    if (req.body.name == undefined) {
        return res.status(400).send({ message: '\'name\' parameter is empty.' });        
    }

    if (isNaN(parseInt(req.params.id))) {
        return res.status(400).send({ message: 'Invalid user id.' });
    }
    if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
        return res.status(400).send({ message: '\'age\' must be an integer.' });
    }

    const checkUser = await User.findOne({ 'name': req.body.name });
    if (checkUser !== null) {
        return res.status(409).send({ message: 'The user already exists.' });
    }

    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) return next(err);
        if (user === null) {
            return res.status(404).send({ message: 'The user is not found.' });
        }
        user.name = req.body.name;
        user.age = req.body.age;
        user.save(() => {
            res.status(200).send(user);
        });
    });
});

router.delete('/:id', async (req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
        return res.status(400).send({ message: 'Invalid user id.' });
    }
    User.findOne({ id: req.params.id }, (err, user) => {
        if (err)
            return next(err);
        if (user === null) {
            return res.status(404).send({ message: 'The user is not found.' });
        }
        User.deleteOne({ id: req.params.id }, function (err, result) {
            if (err) return next(err);
            res.status(200).send({'id': user.id, 'name': user.name, 'age': user.age});
        });
    })

});

router.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status);
    res.json({ error: err });
})


module.exports = router;
