const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: false,
        default: "anonymous"
    },
    age: {
        type: Number,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

    date: {
        type: Number,
        default: new Date().getTime()
    },
    role: {
        type: String,
        require: true
    }
})


const User = mongoose.model('User', UserSchema);

module.exports = User