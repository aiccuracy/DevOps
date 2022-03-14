const express = require('express');
const { create, readAll, update, deleteOne } = require('./db');
const router = express.Router();

const User = require('./models/user');
const userCount = require('./models/userCount');

router.get('/users', async (req, res) => {
    const users = await readAll()
    if (users.error) {
        res.status(500).json({
            message: error.message,
            users: users.data
        })
    }
    res.status(200).json({
        message: 'success',
        users: users.data
    })
})
module.exports = router;

