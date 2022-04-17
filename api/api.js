const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const User = require('../models/user');


router.get('', async (req, res) => {
    res.send(await User.find({}));
});

router.get('/:id', async (req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
        return res.status(400).send({ message: 'Invalid user id.' });
    }
    try {
        const targetUser = await User.findOne({ 'id': req.params.id });
        if (!targetUser) {
            return res.status(404).send({ message: 'The user is not found.' });
        }
        res.status(200).send(targetUser);
    } catch (err) {
        return next(err);
    }
})

router.post('', async (req, res, next) => {
    if (req.body.name === undefined) {
        return res.status(400).send({ message: '\'name\' parameter is empty.' });
    }
    if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
        return res.status(400).send({ message: '\'age\' must be an integer.' });
    }
    try {
        const checkUser = await User.findOne({ 'name': req.body.name });
        if (checkUser) {
            return res.status(409).send({ message: 'The user already exists.' });
        }

        const user = new User();
        user.name = req.body.name;
        user.age = req.body.age;

        await user.save();
        res.status(200).send(user);

    } catch (err) {
        return next(err);
    }
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

    try { 
        const targetUser = await User.findOne({ 'id': req.params.id });
        if (!targetUser) {
            return res.status(404).send({ message: 'The user is not found.' });
        }

        const checkUser = await User.findOne({ 'name': req.body.name });
        if (checkUser) {
            return res.status(409).send({ message: 'The user already exists.' });
        } 

        targetUser.name = req.body.name;
        targetUser.age = req.body.age;

        await targetUser.save();
        return res.status(200).send(targetUser);

    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
        return res.status(400).send({ message: 'Invalid user id.' });
    }
    try {
        const targetUser = await User.findOne({ 'id': req.params.id });
        if (!targetUser) {
            return res.status(404).send({ message: 'The user is not found.' });
        }

        const deleteUser = await User.deleteOne({ 'id': req.params.id });
        if (deleteUser.deletedCount === 1) {
            res.status(200).send({ 'id': targetUser.id, 'name': targetUser.name, 'age': targetUser.age });
        }
    } catch (err) {
        return next(err);
    }
});


router.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status);
    res.json({ error: err });
})

module.exports = router;
