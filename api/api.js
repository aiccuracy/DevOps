const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const User = require("../models/user");
const { NotFoundError, InputError, DuplicateError } = require("./error-handler");

router.get("", async (req, res) => {
    res.send(await User.find({}));
});

router.get("/:id", async (req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
        const err = new InputError("Invalid user id.");
        next(err);
    }
    try {
        const targetUser = await User.findOne({ id: req.params.id });
        if (!targetUser) {
            throw new NotFoundError("User not found.");
        }
        res.status(200).send(targetUser);
    } catch (err) {
        return next(err);
    }
});

router.post("", async (req, res, next) => {
    if (req.body.name === undefined) {
        const err = new InputError("'name' parameter is empty.");
        next(err);
    }
    if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
        const err = new InputError("'age' must be an integer.");
        next(err);
    }
    try {
        const checkUser = await User.findOne({ name: req.body.name });
        if (checkUser) {
            throw new DuplicateError("The user already exists.");
        }

        const user = new User();
        user.name = req.body.name;
        user.age = req.body.age;

        await user.save();
        res.status(200).send(user);
    } catch (err) {
        return next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    if (req.body.name == undefined) {
        const err = new InputError("'name' parameter is empty.");
        next(err);
    }

    if (isNaN(parseInt(req.params.id))) {
        const err = new InputError("Invalid user id.");
        next(err);
    }
    if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
        const err = new InputError("'age' must be an integer.");
        next(err);
    }

    try {
        const targetUser = await User.findOne({ id: req.params.id });
        if (!targetUser) {
            throw new NotFoundError("User not found.");
        }

        const checkUser = await User.findOne({ name: req.body.name });
        if (checkUser) {
            throw new DuplicateError("The user already exists.");
        }

        targetUser.name = req.body.name;
        targetUser.age = req.body.age;

        await targetUser.save();
        return res.status(200).send(targetUser);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    if (isNaN(parseInt(req.params.id))) {
        const err = new InputError("Invalid user id.");
        next(err);
    }
    try {
        const targetUser = await User.findOne({ id: req.params.id });
        if (!targetUser) {
            throw new NotFoundError("User not found.");
        }

        const deleteUser = await User.deleteOne({ id: req.params.id });
        if (deleteUser.deletedCount === 1) {
            res.status(200).send({ id: targetUser.id, name: targetUser.name, age: targetUser.age });
        } else {
            throw new NotFoundError("User not found.");
        }
    } catch (err) {
        return next(err);
    }
});

router.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status).json({ message: err.message });
});

module.exports = router;
