const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const User = require("../models/user");
const { NotFoundError, InputError, DuplicateError } = require("./error-handler");

router.get("", async (req, res) => {
    res.send(await User.find({}));
});

router.get("/:id", async (req, res, next) => {
    try {
        if (isNaN(parseInt(req.params.id))) {
            throw new InputError("Invalid user id.");
        }
        const targetUser = await User.findOne({ id: req.params.id });
        if (!targetUser) {
            throw new NotFoundError();
        }
        res.status(200).send(targetUser);
    } catch (err) {
        return next(err);
    }
});

router.post("", async (req, res, next) => {
    try {
        if (req.body.name === undefined) {
            throw new InputError("'name' parameter is empty.");
        }
        if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
            throw new InputError("'age' must be an integer.");
        }

        const checkUser = await User.findOne({ name: req.body.name });
        if (checkUser) {
            throw new DuplicateError();
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
    try {
        if (req.body.name == undefined) {
            throw new InputError("'name' parameter is empty.");
        }

        if (isNaN(parseInt(req.params.id))) {
            throw new InputError("Invalid user id.");
        }
        if (!Number.isInteger(req.body.age) || req.body.age <= 0) {
            throw new InputError("'age' must be an integer.");
        }

        const targetUser = await User.findOne({ id: req.params.id });
        if (!targetUser) {
            throw new NotFoundError();
        }

        const checkUser = await User.findOne({ name: req.body.name });
        if (checkUser) {
            throw new DuplicateError();
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
    try {
        if (isNaN(parseInt(req.params.id))) {
            throw new InputError("Invalid user id.");
        }
        const targetUser = await User.findOne({ id: req.params.id });
        if (!targetUser) {
            throw new NotFoundError();
        }

        const deleteUser = await User.deleteOne({ id: req.params.id });
        if (deleteUser.deletedCount === 1) {
            res.status(200).send({ id: targetUser.id, name: targetUser.name, age: targetUser.age });
        } else {
            throw new NotFoundError();
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
