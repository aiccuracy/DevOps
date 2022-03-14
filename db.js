const user = require('./models/user');
const userInfo = require('./models/user');

exports.readAll = async () => {
    const users = await userInfo.find({})
    if (!users) throw new Error('Book not found')
    return {error: null, data: users}
}