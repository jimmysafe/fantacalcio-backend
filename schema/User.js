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
    }],
    players: [{
        player: {
            type: Schema.Types.ObjectId,
            ref: 'player'
        },
        auction: {
            type: Schema.Types.ObjectId,
            ref: 'auction'
        },
        amount_paid: {
            type: Number
        }   
    }],
    credits: [{
        amount: Number,
        auction: {
            type: Schema.Types.ObjectId,
            ref: 'auction'
        }
    }],
    ready: Boolean
})


const User = mongoose.model('user', UserSchema)

module.exports = User