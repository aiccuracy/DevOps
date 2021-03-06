const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIdSetter = require("./auto-id-setter");

const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    age: {
        type: Number,
        default: null,
        integer: true,
    },
});

autoIdSetter(userSchema, mongoose, "application", "id");
module.exports = userSchema;

module.exports = mongoose.model("userList", userSchema);
