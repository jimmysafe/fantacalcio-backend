const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    nickName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    auctions: [{
        type: Schema.Types.ObjectId,
        ref: 'auction'
    }]
})


const User = mongoose.model('user', UserSchema)

module.exports = User