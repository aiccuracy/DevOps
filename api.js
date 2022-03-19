const express = require('express');
const router = express.Router();
const User = require('./models/user');


router.get('/users', async (req, res) => {
    res.send(await User.find({}))
});

router.get('/users/:id', async (req, res) => {
    User.findOne({ id: req.params.id }, function (err, user) {
        if (err) return res.status(500).json({ error: err });
        if (!user) return res.status(404).json({ error: "GET : ID Doesn't exists" });
        res.json(user);
    })
});

router.post('/users', async (req, res) => {
    const user = new User();
    user.name = req.body.name;
    user.age = req.body.age;

    user.save(function (err) {
        if (err) {
            res.json({ message: "Failed to post" });
            return;
        }
        res.json({ message: "Success POST" });
    });
});


router.put('/users/:id', async (req, res) => {
    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) return res.status(500).json({ error: "PUT : Database Failure" });
        if (!user) return res.status(404).json({ error: "PUT: ID doesn't exist" });

        user.name = req.body.name;
        user.age = req.body.age;
        user.save(function (err) {
            if (err) res.status(500).json({ error: 'Failed to update!' });
            res.json({ message: 'PUT : SUCCESS' });
        });
    });
});

router.delete('/users/:id', async (req, res) => {
    User.deleteOne({ id: req.params.id }, function (err, output) {
        if (err) return res.status(500).json({ error: "DELETE : Database Failure" });
        res.json({ message: "DELETE : SUCCESS" });
        res.status(204).end();
    });
});


module.exports = router;

