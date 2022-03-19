const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    age: {type: Number}
})

module.exports = mongoose.model('Users', userSchema);