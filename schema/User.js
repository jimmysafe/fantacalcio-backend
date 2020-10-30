const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    auction: {
        type: String,
        required: true
    },
    ready: Boolean
})


const User = mongoose.model('user', UserSchema)

module.exports = User