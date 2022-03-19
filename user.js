const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    age: {type: Number}
})

const userCount = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    totalUser: {type: Number}
})

module.exports = mongoose.model('Users', userSchema);
module.exports = mongoose.model('userCount', userCount);