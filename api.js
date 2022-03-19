const express = require('express');
const router = express.Router();
const User = require('./models/user');

router.get('/users', async (req, res) => {
    res.send(await User.find({}))
});

router.get('/users/:id', async (req, res, next) => {
    User.findOne({ id: req.params.id }, function (err, user) {
        if (!user) {
            res.json({ message: "ID Not Found" });
            return next(err);
        }
        if (err) return next(err);

        res.json(user);
    })
});

router.post('/users', async (req, res, next) => {
    const user = new User();
    user.name = req.body.name;
    user.age = req.body.age;

    user.save(function (err) {
        if (!user.name) {
            res.json({ message: "Please write down your name." });
            return next(err);
        }
        if (err) {
            return next(err);
        }
        res.json({ message: "Success POST" });
    });
});


router.put('/users/:id', async (req, res, next) => {
    User.findOne({ id: req.params.id }, (err, user) => {
        if (!user) {
            res.json({ message: "ID NOT FOUND" });
            return next(err);
        }
        if (err) return next(err);
        user.name = req.body.name;
        user.age = req.body.age;
        user.save(function (error) {
            if (error) return next(error);
            res.json({ message: "Successfully updated!" });
        });
    });
});

router.delete('/users/:id', async (req, res) => {
    User.deleteOne({ id: req.params.id }, function (err) {
        if (err) return next(err);
        res.json({ message: "Successfully deleted" });
        res.status(204).end();
    });
});

module.exports = router;

