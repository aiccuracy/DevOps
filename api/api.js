const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/users', async (req, res) => {
    res.send(await User.find({}))
});

router.get('/users/:id', (req, res, next) => { 
    User.findOne({ id: req.params.id }, function (err, user) { 
        if (isNaN(parseInt(req.params.id))) {
            res.status(400).send({ message: "Invalid user id." });
            return next(err);
        }
        if (user == null) {
            res.status(404).send({ message: "The user is not found." });
            return next(err);
        } 
        res.status(200).send(user);
    })
})

router.post('/users', async (req, res, next) => {
    const user = new User();
    const username = req.body.name;
    user.name = username;
    user.age = req.body.age;
    const checkUser = await User.findOne({ name:username });
    if (checkUser !== null) {
        res.status(409).send({ message: 'The user already exists.' });
        return next();
    }
    if (username === undefined) {
        res.status(400).send({ message: '\'name\' parameter is empty.' });
        return next();
    }
    if (typeof(user.age) !== 'number') {
        res.status(400).send({ message: '\'age\' must be an integer.' });
        return next();
    }

    user.save(() => {
        res.status(200).send(user);
     })
})
 
router.put('/users/:id', async (req, res, next) => {
    const username = req.body.name;
    const checkUser = await User.findOne({ name: username });
    if (checkUser !== null) {
        res.status(409).send({ message: 'The user already exists.' });
        return next();
    }
    if (isNaN(parseInt(req.params.id))) {
        res.status(400).send({ message: 'Invalid user id.' });
        return next();
    }
    
    User.findOne({ id: req.params.id }, (err, user) => {
        if (user === null) {
            res.status(404).send({ message: 'The user is not found.' });
            return next(err);
        }
        if (typeof (req.body.age) !== 'number') {
            res.status(400).send({ message: '\'age\' must be an integer.' });
            return next(err);
        }

        user.name = username;
        user.age = req.body.age;
        user.save(() => {
            res.status(200).send(user);
        });
    });
});

// delete 부분 에러 핸들링!
router.delete('/users/:id', async (req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
        res.status(400).send({ message: 'Invalid user id.' });
        return next();
    }

    User.findOne({ id: req.params.id }, (err, user) => {
        if (user === null) {
            res.status(404).send({ message: 'The user is not found.' });
            return next(err);
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
    res.render('error', { error: err });
})


module.exports = router;
